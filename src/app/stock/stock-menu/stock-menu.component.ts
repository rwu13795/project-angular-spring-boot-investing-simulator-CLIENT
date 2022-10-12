import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import { selectCurrentSymbol } from "../stock-state/stock.selectors";

@Component({
  selector: "app-stock-menu",
  templateUrl: "./stock-menu.component.html",
  styleUrls: ["./stock-menu.component.css"],
})
export class StockMenuComponent implements OnInit, OnDestroy {
  private symbol$?: Subscription;
  public symbol: string = "";

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.symbol$ = this.store
      .select(selectCurrentSymbol)
      .subscribe((data) => (this.symbol = data));
  }

  ngOnDestroy(): void {
    if (this.symbol$) this.symbol$.unsubscribe();
  }
}
