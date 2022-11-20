import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ChartComponent,
  ApexTitleSubtitle,
  ApexTooltip,
} from "ng-apexcharts";
import { ColumnChart } from "../../stock-models";
import { StockChartService } from "../stock-chart.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

@Component({
  selector: "app-column-chart",
  templateUrl: "./column-chart.component.html",
  styleUrls: ["./column-chart.component.css"],
})
export class ColumnChartComponent implements OnChanges {
  @ViewChild("column_chart") chart?: ChartComponent;
  @Input() positionType: number = 1;
  @Input() transactionType: string = "";
  @Input() chartDataBuy: ColumnChart[] = [];
  @Input() chartDataSell: ColumnChart[] = [];
  @Input() isLargeScreen: boolean = true;

  public chartOptions?: ChartOptions;
  public loading: boolean = true;

  constructor(private stockChartService: StockChartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.transactionType === "") return;
    this.loading = true;
    if (this.transactionType === "buy") {
      this.setChartOptions(this.chartDataBuy);
    } else {
      this.setChartOptions(this.chartDataSell);
    }
    this.loading = false;
  }

  private setChartOptions(chartData: ColumnChart[]) {
    // real the documentation https://apexcharts.com/docs/series/
    // I am pssing a string containing the data info in the "x"
    // and the bar value to "y". The "x" value will be in the formatter
    // "w.globals.labels"
    if (chartData.length > 0 && chartData.length < 6) {
      // add some placehold data points, the column bar will be
      // too wide if the data points are too few
      let temp: ColumnChart[] = [];
      for (let i = 0; i < 6 - chartData.length; i++) {
        temp.push({ x: "", y: 0 });
      }
      chartData.unshift(...temp);
    }
    let title = "";
    if (this.transactionType === "buy") {
      if (this.positionType === 1) {
        title = "Buy";
      } else {
        title = "Sell Short";
      }
    } else {
      if (this.positionType === 1) {
        title = "Sell";
      } else {
        title = "Buy To Cover";
      }
    }

    this.chartOptions = {
      series: [
        {
          name: "Column Chart",
          data: chartData,
        },
      ],
      chart: {
        type: "bar",
        width: "100%",
        height: this.isLargeScreen ? 350 : 300,
        fontFamily: '"Quantico", sans-serif',
        toolbar: { show: false, tools: { zoom: false } },
      },
      plotOptions: {
        bar: {
          colors: {
            ranges: [
              {
                from: -Infinity,
                to: 0,
                color: "#e74c3c",
              },
              {
                from: 0,
                to: Infinity,
                color: this.transactionType === "buy" ? "#1093df" : "#2ecc71",
              },
            ],
          },
          columnWidth: "80%",
        },
      },
      title: {
        text: title,
        align: "left",
        style: {
          fontSize: this.isLargeScreen ? "26px" : "20px",
        },
      },
      tooltip: {
        enabled: true,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          let value = series[seriesIndex][dataPointIndex];
          let label = w.globals.labels[dataPointIndex];

          return this.stockChartService.setCustomTooltip_column(value, label);
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        labels: {
          formatter: function (y) {
            return y.toLocaleString(undefined, { maximumFractionDigits: 0 });
          },
        },
      },
      xaxis: {
        type: "category",
        labels: { show: false },
      },
    };
  }
}
