import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
  SimpleChanges,
  Input,
} from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from "ng-apexcharts";
import { Response_transaction } from "src/app/user/user-models";
import { VolumeData } from "../../stock-models";
import { StockChartService } from "../stock-chart.service";

type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
};

@Component({
  selector: "app-overall-chart",
  templateUrl: "./overall-chart.component.html",
  styleUrls: ["./overall-chart.component.css"],
})
export class OverallChartComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild("overall_chart", { static: false }) chart!: ChartComponent;
  @Input() chartData: VolumeData[] = [];
  @Input() isLargeScreen: boolean = true;

  public chartOptions?: ChartOptions;
  public loading: boolean = true;

  constructor(private stockChartService: StockChartService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // ----- NOTE ----- //
    if (this.chartData.length === 0) return;
    this.loading = true;
    this.setChartOption();
    this.loading = false;
  }

  ngOnDestroy(): void {}

  private setChartOption() {
    this.chartOptions = {
      series: [
        {
          name: "Total",
          data: this.chartData,
        },
      ],
      chart: {
        type: "area",
        width: "100%",
        height: this.isLargeScreen ? 350 : 300,
        fontFamily: '"Quantico", sans-serif',
        toolbar: { show: false, tools: { zoom: false } },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        area: {
          fillTo: "end",
        },
      },
      stroke: {
        curve: "straight",
        width: 2,
      },
      title: {
        text: "Overall Realized Gain/Loss",
        align: "left",
        style: {
          fontSize: this.isLargeScreen ? "26px" : "20px",
        },
      },
      xaxis: {
        // if the "x" value is a number, no matter what "type" you set,
        // the "xaxis" will use the "x" value as timeline, values in "x"
        // are not consistent (gap between time), then this gap will displayed
        // in the chart in a uglu way. So I have to use string or Date as "x" value
        type: "category",
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: {
        tickAmount: 6,
        floating: false,
        labels: {
          formatter: (val) => {
            // console.log(val);
            return val.toLocaleString();
          },
          style: { colors: "#6b6b6b" },
          offsetY: -7,
          offsetX: 0,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      fill: { opacity: 0.5 },
      tooltip: {
        // x: { show: false },
        // enabled: true,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          const value = series[seriesIndex][dataPointIndex];
          const date = w.globals.categoryLabels[dataPointIndex];

          return this.stockChartService.setCustomTooltip_overall(value, date);
        },
        fixed: {
          enabled: false,
          position: "topRight",
        },
      },
      grid: {
        yaxis: {
          lines: {
            offsetX: -30,
          },
        },
        padding: { left: 20 },
      },
    };
  }
}

/*

// ----- NOTE ----- //
When you pass an array fram parent to child, DO NOT modify the array in the
parent, don't know why, the modified array will NOT be detected by "OnChanges" 
BUT the value is passed in the "currentValue". 

DONT know it is a bug or what, just DONT pass an array which you have to update
it in the parent.

In this case, I should map the arrays inside the "getAssetTransactions" observable
before subcribe the transactions data in the parent component


*/
