import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  selectCurrentSymbol,
  selectStockActiveMenu,
} from "../stock-state/stock.selectors";
import { StockMenu } from "../stock-models";

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

  public symbol: string = "";
  public activeMenu: StockMenu = StockMenu.summary;
  public showButton: boolean = false;
  public isHidden: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.symbol$ = this.store
      .select(selectCurrentSymbol)
      .subscribe((data) => (this.symbol = data));

    this.activeMenu$ = this.store
      .select(selectStockActiveMenu)
      .subscribe((data) => {
        this.activeMenu = data;
        this.showButton = this.activeMenu === StockMenu.chart;
      });
  }

  ngOnDestroy(): void {
    if (this.symbol$) this.symbol$.unsubscribe();
    if (this.activeMenu$) this.activeMenu$.unsubscribe();
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
}
