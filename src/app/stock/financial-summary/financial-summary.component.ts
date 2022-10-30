import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  combineLatest,
  forkJoin,
  map,
  Observable,
  Subscription,
  take,
} from "rxjs";
import { setCurrentSymbol } from "../stock-state/stock.actions";
import { selectCompanyProfile } from "../stock-state/stock.selectors";
import { StockService } from "../stock.service";

interface FinancialSummary {
  symbol: string;
  price: number;
  beta: number;
  volumeAvg: number;
  marketCap: number;
  outstandingShares: number;
  open: number;
  previousClose: number;
  dayLow: number;
  dayHigh: number;
  range: string;
  EPS: number;
  ROE: number;
  ROA: number;
  operatingMargin: number;
  debtEquity: number;
  pe: number;
  pb: number;
}

@Component({
  selector: "app-financial-summary",
  templateUrl: "./financial-summary.component.html",
  styleUrls: ["./financial-summary.component.css"],
})
export class FinancialSummaryComponent implements OnInit {
  public symbol: string = "";
  public news: string = "";
  private financialSummary$?: Subscription;
  private selector$?: Subscription;
  public financialSummary?: FinancialSummary;
  public isLargeScreen?: boolean;

  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private store: Store,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    // I can either use the ngrx "selector" or the "route" to extract the current symbol
    this.route.params.subscribe((params: Params) => {
      this.symbol = params["symbol"].toUpperCase();
    });

    this.breakpointObserver
      .observe(["(min-width: 1200px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isLargeScreen = true;
        } else {
          this.isLargeScreen = false;
        }
      });

    // when the component is mounted, the profile might not be fetched yet,
    // so when I select the profile the first time, it might be null.
    // that is why I need to subscribe to the selector, if there is new update
    // after the profile has been fetched, use the "forkJoin" as an inner observable
    // to handle the fetching of financial ratio and realTimePrice
    this.selector$ = this.store
      .select(selectCompanyProfile)
      .pipe(
        map((profile) => {
          if (!profile) return;

          this.financialSummary$ = forkJoin([
            this.stockService.getRealTimePrice(this.symbol).pipe(take(1)),
            this.stockService.getFinancialRatios(this.symbol).pipe(take(1)),
            this.store.select(selectCompanyProfile).pipe(take(1)),
          ])
            .pipe(
              // forkJoin is very similar to Promise.all, it will execute and wait
              // for all the aync http request.
              // The responses will be passed into an array [response_1, response_2]
              map(([[realTimePrice], [financialRatio], profile]) => {
                if (!profile) return;
                // since the "realTimePrice" and "financialRatio" is in the first element,
                // use [realTimePrice], and [financialRatio] to destructure
                this.financialSummary = {
                  symbol: realTimePrice.symbol,
                  price: realTimePrice.price,
                  beta: profile.beta,
                  volumeAvg: realTimePrice.avgVolume,
                  marketCap: realTimePrice.marketCap,
                  outstandingShares: realTimePrice.sharesOutstanding,
                  open: realTimePrice.open,
                  previousClose: realTimePrice.previousClose,
                  dayLow: realTimePrice.dayLow,
                  dayHigh: realTimePrice.dayHigh,
                  range: profile.range,
                  EPS: realTimePrice.eps,
                  ROE: financialRatio.returnOnEquityTTM,
                  ROA: financialRatio.returnOnAssetsTTM,
                  operatingMargin: financialRatio.operatingProfitMarginTTM,
                  debtEquity: financialRatio.debtEquityRatioTTM,
                  pe: financialRatio.peRatioTTM,
                  pb: financialRatio.priceToBookRatioTTM,
                };
              })
            )
            .subscribe(); // subscribe to the "forkJoin"
        })
      )
      .subscribe(); // subscribe to the selector
  }

  ngOnDestroy(): void {
    if (this.selector$) this.selector$.unsubscribe();
    if (this.financialSummary$) this.financialSummary$.unsubscribe();
  }
}
