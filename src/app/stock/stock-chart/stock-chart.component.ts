import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import { setCurrentSymbol } from "../stock-state/stock.actions";

@Component({
  selector: "app-stock-chart",
  templateUrl: "./stock-chart.component.html",
  styleUrls: ["./stock-chart.component.css"],
})
export class StockChartComponent implements OnInit {
  public option: string = "1D";
  public symbol: string = "";

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.symbol = params["symbol"].toUpperCase();
      this.store.dispatch(setCurrentSymbol({ symbol: this.symbol }));
    });
  }

  onSelectDayRange(option: string) {
    console.log(option);
    this.option = option;
  }
}
