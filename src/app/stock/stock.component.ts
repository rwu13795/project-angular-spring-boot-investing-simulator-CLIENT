import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { ActivatedRoute, Params } from "@angular/router";
import { AppState } from "../ngrx-store/app.reducer";
import {
  selectCurrentSymbol,
  selectStockActiveMenu,
} from "./stock-state/stock.selectors";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { StockMenu } from "./stock-models";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"],
})
export class StockComponent implements OnInit, OnDestroy {
  public isLargeScreen: boolean = true;
  public activeMenu$ = this.store.select(selectStockActiveMenu);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    // use Angular material CDK to observe the current window width
    this.breakpointObserver
      .observe(["(min-width: 1200px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isLargeScreen = true;
        else this.isLargeScreen = false;
      });
  }

  get StockMenu() {
    return StockMenu;
  }

  ngOnDestroy(): void {}
}
