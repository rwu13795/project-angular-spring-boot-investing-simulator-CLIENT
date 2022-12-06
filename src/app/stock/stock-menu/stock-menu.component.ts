import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Subscription, take } from "rxjs";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  selectCurrentSymbol,
  selectPreviousSymbol,
  selectStockActiveMenu,
} from "../stock-state/stock.selectors";
import { StockMenu } from "../stock-models";
import { StockService } from "../stock.service";
import {
  selectAssets,
  selectHasAuth,
} from "src/app/user/user-state/user.selectors";
import { Router } from "@angular/router";
import { setPreviousSymbol } from "../stock-state/stock.actions";

@Component({
  selector: "app-stock-menu",
  templateUrl: "./stock-menu.component.html",
  styleUrls: ["./stock-menu.component.css"],
})
export class StockMenuComponent implements OnInit, OnDestroy {
  private symbol$?: Subscription;
  private assets$?: Subscription;
  private activeMenu$?: Subscription;
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

    this.store
      .select(selectPreviousSymbol)
      .pipe(take(1))
      .subscribe((previousSymbol) => {
        this.symbol$ = this.store
          .select(selectCurrentSymbol)
          .subscribe((currentSymbol) => {
            if (currentSymbol === previousSymbol) return;

            this.symbol = currentSymbol;
            this.store.dispatch(setPreviousSymbol({ symbol: currentSymbol }));

            if (currentSymbol && currentSymbol !== "") {
              // after getting the symbol from store
              this.activeMenu$ = this.store
                .select(selectStockActiveMenu)
                .subscribe((menu) => {
                  this.activeMenu = menu;
                  this.showButton = this.activeMenu === StockMenu.chart;

                  if (this.activeMenu === StockMenu.asset && !this.hasAuth) {
                    this.route.navigate(["/user/sign-in"]);
                  }
                  // update the price whenever the menu is changed
                  this.updatePrice();

                  // fetch the latest price in every 20s if the current menu is not "chart"
                  if (
                    this.activeMenu !== StockMenu.chart &&
                    this.stockService.isMarketOpen()
                  ) {
                    clearInterval(this.updateTimer);
                    this.updateTimer = setInterval(() => {
                      this.updatePrice();
                    }, 1000 * 20);
                  }

                  if (this.activeMenu === StockMenu.chart) {
                    clearInterval(this.updateTimer);
                  }
                });

              this.assets$ = this.store
                .select(selectAssets)
                .subscribe((assets) => {
                  if (assets) this.hasAsset = !!assets[currentSymbol];
                });
            }
          });
      });
  }

  get StockMenu() {
    return StockMenu;
  }

  private updatePrice() {
    this.stockService.getRealTimePrice(this.symbol).pipe(take(1)).subscribe();
  }

  ngOnDestroy(): void {
    clearInterval(this.updateTimer);
    if (this.symbol$) this.symbol$.unsubscribe();
    if (this.activeMenu$) this.activeMenu$.unsubscribe();
    if (this.assets$) this.assets$.unsubscribe();
    if (this.hasAuth$) this.hasAuth$.unsubscribe();
  }
}

/*



*/
