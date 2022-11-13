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
import { AppState } from "src/app/ngrx-store/app.reducer";
import { StockChartService } from "../stock-chart/stock-chart.service";
import { StockMenu } from "../stock-models";
import {
  setCurrentSymbol,
  setStockActiveMenu,
} from "../stock-state/stock.actions";
import { selectCompanyProfile } from "../stock-state/stock.selectors";
import { StockService } from "../stock.service";

interface FinancialSummary {
  symbol: string;
  price: string;
  beta: string;
  volumeAvg: string;
  marketCap: string;
  outstandingShares: string;
  open: string;
  previousClose: string;
  dayLow: string;
  dayHigh: string;
  range: string;
  EPS: string;
  ROE: string;
  ROA: string;
  operatingMargin: string;
  debtEquity: string;
  pe: string;
  pb: string;
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
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver,
    private stockChartService: StockChartService
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

    this.store.dispatch(setStockActiveMenu({ menu: StockMenu.summary }));

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
                  price: realTimePrice.price.toFixed(2),
                  beta: profile.beta.toFixed(2),
                  volumeAvg: this.stockChartService.toSignificantDigit(
                    realTimePrice.avgVolume
                  ),
                  marketCap: this.stockChartService.toSignificantDigit(
                    realTimePrice.marketCap
                  ),
                  outstandingShares: this.stockChartService.toSignificantDigit(
                    realTimePrice.sharesOutstanding
                  ),
                  open: realTimePrice.open.toFixed(2),
                  previousClose: realTimePrice.previousClose.toFixed(2),
                  dayLow: realTimePrice.dayLow.toFixed(2),
                  dayHigh: realTimePrice.dayHigh.toFixed(2),
                  range: profile.range,
                  EPS: realTimePrice.eps.toFixed(2),
                  ROE: (100 * financialRatio.returnOnEquityTTM).toFixed(2),
                  ROA: (100 * financialRatio.returnOnAssetsTTM).toFixed(2),
                  operatingMargin: (
                    100 * financialRatio.operatingProfitMarginTTM
                  ).toFixed(2),
                  debtEquity: (100 * financialRatio.debtEquityRatioTTM).toFixed(
                    2
                  ),
                  pe: financialRatio.peRatioTTM.toFixed(2),
                  pb: financialRatio.priceToBookRatioTTM.toFixed(2),
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
