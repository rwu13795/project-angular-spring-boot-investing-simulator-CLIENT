import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
// import { ChartOptions } from "../chart/custom-chart.component";
import {
  CandleData,
  Response_searchByName,
  StockService,
  VolumnData,
} from "./stock.service";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle,
} from "ng-apexcharts";

type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"],
})
export class StockComponent implements OnInit, OnDestroy {
  inputValue: string = "";
  stockSearchResult: Response_searchByName[] = [];
  stockSearchResult$?: Subscription;
  candelData: CandleData[] = [];
  volumnData: VolumnData[] = [];
  chartData$?: Subscription;
  inputTimer?: any;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {}

  onSearchStockByName() {
    this.stockSearchResult$ = this.stockService
      .searchStockByName(this.inputValue)
      .subscribe((data) => {
        this.stockSearchResult = data;
      });
  }

  onInputChange(event: KeyboardEvent) {
    let value = (event.target as HTMLInputElement).value;

    if (this.inputTimer) clearTimeout(this.inputTimer);

    // after each user input change, set a 800ms timer to wait and see if user
    // is still entering input. If there is new input, the old timer will be
    // cleared and new timer will be created. If there is no input change
    // after 800ms, then trigger the callback (send http request and etc...)
    this.inputTimer = setTimeout(() => {
      console.log("input stop:", value);

      if (value.toLowerCase() === "google") {
        value = "goog";
      }

      this.stockSearchResult$ = this.stockService
        .searchStockByName(value)
        .subscribe((data) => {
          this.stockSearchResult = data;
        });

      this.inputValue = value;
    }, 800);
  }

  fetchHistory() {
    this.chartData$ = this.stockService
      .fetchHistoryPrice()
      .subscribe((data) => {
        this.candelData = data.candles;
        this.volumnData = data.volumns;
      });
  }

  ngOnDestroy(): void {
    if (this.stockSearchResult$) this.stockSearchResult$.unsubscribe();
    if (this.chartData$) this.chartData$.unsubscribe();
  }
}
