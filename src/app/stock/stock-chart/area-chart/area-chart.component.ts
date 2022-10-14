import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations,
  ApexStroke,
} from "ng-apexcharts";
import { Subscription } from "rxjs";
import { ChartData } from "../../stock-models";
import { StockService } from "../../stock.service";
import { StockChartService } from "../stock-chart.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  colors: any;
  toolbar: any;
};

@Component({
  selector: "app-area-chart",
  templateUrl: "./area-chart.component.html",
  styleUrls: ["./area-chart.component.css"],
})
export class AreaChartComponent implements OnInit, OnDestroy {
  @ViewChild("area_chart", { static: false }) chart!: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;

  @Input() symbol: string = "";
  private chartData$?: Subscription;
  public timeRange: string = "";

  constructor(
    private stockService: StockService,
    private stockChartService: StockChartService
  ) {}

  ngOnInit(): void {
    this.chartData$ = this.stockService
      .fetchHistoryPrice("3M", this.symbol)
      .subscribe((data) => {
        this.timeRange = `${data.candleLine[0].x.toLocaleDateString()} - ${data.candleLine[
          data.candleLine.length - 1
        ].x.toLocaleDateString()}`;

        this.setChartOptions(data);
      });
  }

  ngOnDestroy(): void {
    if (this.chartData$) this.chartData$.unsubscribe();
  }

  private setChartOptions(data: ChartData) {
    this.chartOptions = {
      series: [{ data: data.candleLine, name: "Price" }],
      chart: { type: "area", height: 350 },
      dataLabels: { enabled: false },
      markers: {
        size: 0,
      },
      yaxis: {
        labels: {
          show: true,
          formatter: (value) => {
            return this.stockChartService.toLocalString(value);
          },
        },
      },
      xaxis: {
        type: "category",
        tickAmount: 6,
        labels: {
          show: true,
          formatter: (value) => {
            return new Date(value).toLocaleDateString();
          },
        },
      },
      tooltip: {
        x: {
          formatter: (value, options: any) => {
            const { w, seriesIndex, dataPointIndex } = options;
            const date =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex].x;
            return new Date(date).toLocaleString();
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
    };
  }
}

/*

(1) when the type of the "xaxis" is "category", is just the dataPointIndex
    number of the series, not the "x" date value. I have to extract the "date"
    by using the properties inside the options

*/
