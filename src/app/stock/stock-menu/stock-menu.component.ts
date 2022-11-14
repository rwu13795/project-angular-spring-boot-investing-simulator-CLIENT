import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import { Subscription, take } from "rxjs";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  selectCurrentSymbol,
  selectStockActiveMenu,
} from "../stock-state/stock.selectors";
import { StockMenu } from "../stock-models";
import { StockService } from "../stock.service";

@Component({
  selector: "app-stock-menu",
  templateUrl: "./stock-menu.component.html",
  styleUrls: ["./stock-menu.component.css"],
})
export class StockMenuComponent implements OnInit, OnDestroy {
  @ViewChild("containerRef") containerRef?: ElementRef<HTMLDivElement>;
  @ViewChild("borderRef") borderRef?: ElementRef<HTMLDivElement>;

  private symbol$?: Subscription;
  private activeMenu$?: Subscription;
  private updateTimer?: any;

  @Input() isSmallScreen: boolean = false;
  public symbol: string = "";
  public activeMenu: StockMenu = StockMenu.summary;
  public showButton: boolean = false;
  public isHidden: boolean = false;

  constructor(
    private store: Store<AppState>,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.symbol$ = this.store.select(selectCurrentSymbol).subscribe((data) => {
      this.symbol = data;
      // after getting the symbol from store
      this.activeMenu$ = this.store
        .select(selectStockActiveMenu)
        .subscribe((data) => {
          this.activeMenu = data;
          this.showButton = this.activeMenu === StockMenu.chart;
          // fetch the latest price in every 30s if the current menu is not "chart"
          if (
            this.activeMenu !== StockMenu.chart &&
            this.stockService.isMarketOpened()
          ) {
            clearInterval(this.updateTimer);
            this.updateTimer = setInterval(() => {
              this.stockService
                .getRealTimePrice(this.symbol)
                .pipe(take(1))
                .subscribe();
            }, 1000 * 30);
          } else {
            console.log("market close || not in chart");
          }
        });
    });
  }

  hideMenu() {
    const container = this.containerRef?.nativeElement;
    if (container) {
      container.style.height = "0px";
      container.style.opacity = "0";
      this.isHidden = true;
    }
  }

  showMenu() {
    const container = this.containerRef?.nativeElement;
    if (container) {
      container.style.height = " 100px";
      container.style.opacity = "1";
      this.isHidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  get StockMenu() {
    return StockMenu;
  }

  ngOnDestroy(): void {
    if (this.symbol$) this.symbol$.unsubscribe();
    if (this.activeMenu$) this.activeMenu$.unsubscribe();
    if (this.updateTimer) clearInterval(this.updateTimer);
  }
}
