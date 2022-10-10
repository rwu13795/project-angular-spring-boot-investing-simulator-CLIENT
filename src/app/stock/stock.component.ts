import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
// import { ChartOptions } from "../chart/custom-chart.component";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { ActivatedRoute } from "@angular/router";

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
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.route);
  }

  ngOnDestroy(): void {}
}
