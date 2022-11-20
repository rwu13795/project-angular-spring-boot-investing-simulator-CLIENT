import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  selectChangePercentage,
  selectCompanyProfile,
  selectChangeInPrice,
  selectCurrentPrice,
  selectCurrentSymbol,
  selectPreviousPrice,
  selectPreviousChangeInPrice,
  selectPreviousChangePercentage,
  selectTimeRange,
} from "../stock-state/stock.selectors";
import { Response_companyProfile } from "../stock-models";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import {
  selectHasAuth,
  selectPortfolio,
  selectWatchlist,
} from "src/app/user/user-state/user.selectors";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "src/app/user/user-state/user.actions";
import { toggleTradeModal } from "../stock-state/stock.actions";

@Component({
  selector: "app-stock-price",
  templateUrl: "./stock-price.component.html",
  styleUrls: ["./stock-price.component.css"],
})
export class StockPriceComponent implements OnInit, OnDestroy {
  private symbol$?: Subscription;
  private profile$?: Subscription;
  private price$?: Subscription;
  private previousPrice$?: Subscription;
  private changeInPrice$?: Subscription;
  private previousChangeInPrice$?: Subscription;
  private changePercentage$?: Subscription;
  private previousChangePercentage$?: Subscription;
  private portfolio$?: Subscription;

  public hasAuth$ = this.store.select(selectHasAuth);
  public symbol: string = "";
  public profile: Response_companyProfile | null = null;
  public price: string[] = ["0"];
  public previousPrice: string[] = ["0"];
  public changeInPrice: string[] = ["0"];
  public previousChangeInPrice: string[] = ["0"];
  public changePercentage: string[] = ["0"];
  public previousChangePercentage: string[] = ["0"];
  public timeRange = this.store.select(selectTimeRange);
  public changeNumber: number = 0;
  public isLargeScreen: boolean = true;
  public isWatched: boolean = false;
  public showStar: boolean = true;

  constructor(
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.symbol$ = this.store
      .select(selectCurrentSymbol)
      .subscribe((symbol) => {
        this.symbol = symbol;

        this.portfolio$ = this.store
          .select(selectPortfolio)
          .subscribe((portfolio) => {
            if (!portfolio) return;
            this.isWatched = !!portfolio.watchlist[symbol];
            this.showStar = !portfolio.assets[symbol];
          });
      });

    this.profile$ = this.store
      .select(selectCompanyProfile)
      .subscribe((data) => {
        this.profile = data;
      });

    this.price$ = this.store.select(selectCurrentPrice).subscribe((data) => {
      this.price = this.toStringArray(data);
    });
    this.previousPrice$ = this.store
      .select(selectPreviousPrice)
      .subscribe((data) => {
        this.previousPrice = this.toStringArray(data);
      });

    this.changeInPrice$ = this.store
      .select(selectChangeInPrice)
      .subscribe((data) => {
        this.changeInPrice = this.toStringArray(data);
        this.changeNumber = data;
      });
    this.previousChangeInPrice$ = this.store
      .select(selectPreviousChangeInPrice)
      .subscribe((data) => {
        this.previousChangeInPrice = this.toStringArray(data);
      });

    this.changePercentage$ = this.store
      .select(selectChangePercentage)
      .subscribe((data) => {
        this.changePercentage = this.toStringArray(data);
      });
    this.previousChangePercentage$ = this.store
      .select(selectPreviousChangePercentage)
      .subscribe((data) => {
        this.previousChangePercentage = this.toStringArray(data);
      });

    this.breakpointObserver
      .observe(["(min-width: 765px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isLargeScreen = true;
        else this.isLargeScreen = false;

        console.log("isLargeScreen", this.isLargeScreen);
      });
  }

  updateWatchlist(isAdded: boolean) {
    if (!this.symbol || !this.profile) return;

    if (isAdded) {
      this.store.dispatch(
        addToWatchlist({
          symbol: this.symbol,
          exchange: this.profile.exchangeShortName,
        })
      );
    } else {
      this.store.dispatch(removeFromWatchlist({ symbol: this.symbol }));
    }
  }

  openTradeModal() {
    this.store.dispatch(toggleTradeModal({ open: true }));
  }

  ngOnDestroy(): void {
    if (this.symbol$) this.symbol$.unsubscribe();
    if (this.profile$) this.profile$.unsubscribe();
    if (this.price$) this.price$.unsubscribe();
    if (this.changeInPrice$) this.changeInPrice$.unsubscribe();
    if (this.changePercentage$) this.changePercentage$.unsubscribe();
    if (this.previousPrice$) this.previousPrice$.unsubscribe();
    if (this.previousChangeInPrice$) this.previousChangeInPrice$.unsubscribe();
    if (this.previousChangePercentage$)
      this.previousChangePercentage$.unsubscribe();
    if (this.portfolio$) this.portfolio$.unsubscribe();
  }

  private toStringArray(data: number): string[] {
    return [
      ...data.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ];
  }
}
