import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { StockService } from "../stock.service";

@Component({
  selector: "app-stock-chart",
  templateUrl: "./stock-chart.component.html",
  styleUrls: ["./stock-chart.component.css"],
})
export class StockChartComponent implements OnInit {
  public option: string = "1D";
  public symbol: string = "";

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.symbol = params["symbol"].toUpperCase();
      console.log(this.symbol);
    });
  }

  onSelectDayRange(option: string) {
    console.log(option);
    this.option = option;
  }
}
