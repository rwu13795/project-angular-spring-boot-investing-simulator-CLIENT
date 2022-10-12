import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import { setCurrentSymbol } from "../stock-state/stock.actions";

@Component({
  selector: "app-financial-summary",
  templateUrl: "./financial-summary.component.html",
  styleUrls: ["./financial-summary.component.css"],
})
export class FinancialSummaryComponent implements OnInit {
  public symbol: string = "";

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.symbol = params["symbol"].toUpperCase();
      this.store.dispatch(setCurrentSymbol({ symbol: this.symbol }));
    });
  }

  ngOnDestroy(): void {}
}
