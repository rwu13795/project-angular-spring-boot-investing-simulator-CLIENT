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

  public symbol: string = "";
  public activeMenu$ = this.store.select(selectStockActiveMenu);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.symbol$ = this.store
      .select(selectCurrentSymbol)
      .subscribe((data) => (this.symbol = data));
  }

  ngOnDestroy(): void {
    if (this.symbol$) this.symbol$.unsubscribe();
  }

  transformOut() {
    const container = this.containerRef?.nativeElement;

    if (container) {
      // menu.style.transform = "translateX(2000px)";
      container.style.height = "0px";
      container.style.opacity = "0";
    }
  }

  transformIn() {
    const container = this.containerRef?.nativeElement;

    if (container) {
      // container.style.transform = "translateX(0)";

      container.style.height = " 110px";
      container.style.opacity = "1";
    }
  }

  get StockMenu() {
    return StockMenu;
  }
}
