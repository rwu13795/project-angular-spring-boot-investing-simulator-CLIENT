import { Component, Input, OnInit, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke,
} from "ng-apexcharts";
import { Subscription } from "rxjs";
import { CandleData, StockService, VolumnData } from "../stock.service";

@Component({
  selector: "app-stock-chart",
  templateUrl: "./stock-chart.component.html",
  styleUrls: ["./stock-chart.component.css"],
})
export class StockChartComponent implements OnInit {
  public option: string = "5D";

  constructor(private stockService: StockService) {}

  onSelectDayRange(option: string) {
    console.log(option);
    this.option = option;
  }

  ngOnInit(): void {}
}
