import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { AppState } from "../ngrx-store/app.reducer";
import {
  setCurrentChangeInPrice,
  setCurrentPrice,
  setCurrentTimeRange,
} from "../stock/stock-state/stock.actions";
import { RealTimeIndex } from "./market-index-models";
import { MarketIndexService } from "./market-index.service";

@Component({
  selector: "app-market-index",
  templateUrl: "./market-index.component.html",
  styleUrls: ["./market-index.component.css"],
})
export class MarketIndexComponent implements OnInit, OnDestroy {
  private fetchTargetIndex$?: Subscription;
  public symbol: string = "^DJI";
  public targetIndex: RealTimeIndex | null = null;
  public dayOption: string = "1D";
  public dayOptions = ["1D", "5D", "1M", "3M", "6M", "1Y", "5Y"];
  public isLargeScreen: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private marketIndexService: MarketIndexService,
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const _symbol = params["symbol"];

      if (_symbol && _symbol !== "") {
        this.symbol = _symbol.toUpperCase();
        // the index data points shoule be stored in the service if the guard was passed
        this.targetIndex = this.marketIndexService.getTargetIndex();
        if (this.targetIndex) {
          this.dayOption = "1D"; // reset the dayOption on symbol change
          this.setDataInState();
        } else {
          this.fetchTargetIndex$ = this.marketIndexService
            .fetchTargetIndex(_symbol)
            .subscribe((data) => {
              this.targetIndex = data;
              this.setDataInState();
            });
        }
      }
    });

    this.breakpointObserver
      .observe(["(min-width: 765px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isLargeScreen = true;
        else this.isLargeScreen = false;
      });
  }

  onSelectTimeRange(dayOption: string) {
    this.dayOption = dayOption;
    this.store.dispatch(setCurrentTimeRange({ timeRange: dayOption }));
  }

  toFixedLocale(number: number, min: number = 2, max: number = 2) {
    return this.marketIndexService.toFixedLocale(number, min, max);
  }

  ngOnDestroy(): void {
    if (this.fetchTargetIndex$) this.fetchTargetIndex$.unsubscribe();
  }

  private setDataInState() {
    // set the points in the StockState in order to use the cylinder to display the digits
    if (this.targetIndex) {
      this.store.dispatch(
        setCurrentPrice({ currentPrice: this.targetIndex.price })
      );
      this.store.dispatch(
        setCurrentChangeInPrice({ changeInPrice: this.targetIndex.change })
      );
    }
  }
}
