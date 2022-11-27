import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import { StockMenu } from "../stock-models";
import {
  setCurrentTimeRange,
  setStockActiveMenu,
} from "../stock-state/stock.actions";

@Component({
  selector: "app-stock-chart",
  templateUrl: "./stock-chart.component.html",
  styleUrls: ["./stock-chart.component.css"],
})
export class StockChartComponent implements OnInit {
  public dayOption: string = "1D";
  public dayOptions = ["1D", "5D", "1M", "3M", "6M", "1Y", "5Y"];
  public symbol: string = "";
  public isLargeScreen: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.symbol = params["symbol"].toUpperCase();
    });

    this.breakpointObserver
      .observe(["(min-width: 765px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isLargeScreen = true;
        else this.isLargeScreen = false;
      });

    this.store.dispatch(setStockActiveMenu({ menu: StockMenu.chart }));
  }

  onSelectTimeRange(dayOption: string) {
    this.dayOption = dayOption;
    this.store.dispatch(setCurrentTimeRange({ timeRange: dayOption }));
  }
}
