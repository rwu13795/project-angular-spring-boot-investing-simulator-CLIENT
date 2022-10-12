import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { ActivatedRoute, Params } from "@angular/router";
import { AppState } from "../ngrx-store/app.reducer";
import { selectCurrentSymbol } from "./stock-state/stock.selectors";

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"],
})
export class StockComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit(): void {
    console.log(this.route);
    this.route.url.subscribe((url) => {
      // this.symbol = params["symbol"].toUpperCase();

      console.log("in stock component url", url);
    });
  }

  ngOnDestroy(): void {}
}
