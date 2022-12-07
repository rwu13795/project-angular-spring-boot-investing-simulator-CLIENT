import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Subscription, take } from "rxjs";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  selectCurrentSymbol,
  selectStockActiveMenu,
} from "../stock-state/stock.selectors";
import { StockMenu } from "../stock-models";
import { StockService } from "../stock.service";
import {
  selectHasAuth,
  selectTargetAsset,
} from "src/app/user/user-state/user.selectors";
import { Router } from "@angular/router";
import { setCurrentSymbol } from "../stock-state/stock.actions";

@Component({
  selector: "app-stock-menu",
  templateUrl: "./stock-menu.component.html",
  styleUrls: ["./stock-menu.component.css"],
})
export class StockMenuComponent implements OnInit, OnDestroy {
  private symbol$?: Subscription;
  private activeMenu$?: Subscription;
  private targetAsset$?: Subscription;
  private hasAuth$?: Subscription;
  private updateTimer?: any;

  @Input() isSmallScreen: boolean = false;
  public hasAuth: boolean = false;
  public symbol: string = "";
  public activeMenu: StockMenu = StockMenu.summary;
  public showButton: boolean = false;
  public isHidden: boolean = false;
  public hasAsset: boolean = false;

  constructor(
    private store: Store<AppState>,
    private route: Router,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.hasAuth$ = this.store.select(selectHasAuth).subscribe((hasAuth) => {
      this.hasAuth = hasAuth;
      if (this.activeMenu === StockMenu.asset && !this.hasAuth) {
        this.route.navigate(["/user/sign-in"]);
      }
    });

    // ------- (1) -------- //
    this.symbol$ = this.store
      .select(selectCurrentSymbol)
      .subscribe(({ symbol, isUpdated }) => {
        if (symbol && symbol !== "" && isUpdated) {
          this.symbol = symbol;

          // when current symbol is selected
          this.updatePrice();

          this.targetAsset$ = this.store
            .select(selectTargetAsset(this.symbol))
            .subscribe((asset) => {
              this.hasAsset = !!asset;
            });

          // set the "isUpdated" to false manully after extracting the current symbol
          this.store.dispatch(setCurrentSymbol({ symbol, updated: false }));
        }
      });

    this.activeMenu$ = this.store
      .select(selectStockActiveMenu)
      .subscribe((menu) => {
        this.activeMenu = menu;
        this.showButton = this.activeMenu === StockMenu.chart;

        if (this.activeMenu === StockMenu.asset && !this.hasAuth) {
          this.route.navigate(["/user/sign-in"]);
        }

        if (this.activeMenu === StockMenu.chart) {
          // clear the 20s interval, let the real-time-chart
          // update the price
          clearInterval(this.updateTimer);
        } else {
          // fetch the latest price in every 15s if the current menu is not "Charts"
          this.updatePrice();
        }
      });
  }

  get StockMenu() {
    return StockMenu;
  }

  private updatePrice() {
    clearInterval(this.updateTimer);
    if (this.stockService.isMarketOpen() && this.symbol !== "") {
      this.updateTimer = setInterval(() => {
        this.stockService
          .getRealTimePrice(this.symbol)
          .pipe(take(1))
          .subscribe();
      }, 1000 * 15);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.updateTimer);
    if (this.symbol$) this.symbol$.unsubscribe();
    if (this.activeMenu$) this.activeMenu$.unsubscribe();
    if (this.targetAsset$) this.targetAsset$.unsubscribe();
    if (this.hasAuth$) this.hasAuth$.unsubscribe();
  }
}

/*
--------- (1) ---------

I have to store the previous symbol in the stock state. When the stock menu
is mounted and there is a "currentSymbol" in the stock state, and the selector
select the "currentSymbol" on init, the new "currentSymbol" might not have been
set (in the stock-guard), so the selector might select the "old" symbol.

This will cause the issue where an updatePrice interval is using the the "old"
symbol. Also, when the selector detect the "update" of the "currentSymbol", it
wiil select the "currentSymbol" again, then another updatePrice interval will be
created using the updated "currentSymbol"

I need to check if (currentSymbol === previousSymbol), if it is true, then it 
means the seleceted "currentSymbol" is not current


*/
