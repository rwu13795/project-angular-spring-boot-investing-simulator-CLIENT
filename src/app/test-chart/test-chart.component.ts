import { Component, OnInit, ViewChild } from "@angular/core";

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
import { ChartData } from "../stock/stock.service";

import { chartData, seriesData, seriesDataLinear } from "./ohlc";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
};

@Component({
  selector: "app-test-chart",
  templateUrl: "./test-chart.component.html",
  styleUrls: ["./test-chart.component.css"],
})
export class TestChartComponent implements OnInit {
  @ViewChild("chartCandle") chartCandle?: ChartComponent;
  @ViewChild("chartBar") chartBar?: ChartComponent;
  public chartCandleOptions: Partial<ChartOptions>;
  public chartBarOptions: Partial<ChartOptions>;

  constructor() {
    // const data: ChartData = { volumns: [], candles: [] };

    // for (let i = chartData.length - 1; i >= 0; i--) {
    //   const { date, open, high, low, close, volume } = chartData[i];
    //   data.candles.push({
    //     x: new Date(date),
    //     y: [open, high, low, close],
    //   });
    //   data.volumns.push({ x: new Date(date), y: volume });
    // }

    this.chartCandleOptions = {
      series: [
        {
          name: "candle",
          data: seriesData,
        },
      ],
      chart: {
        type: "candlestick",
        height: 290,
        id: "candles",
        toolbar: {
          autoSelected: "pan",
          show: false,
        },
        zoom: {
          enabled: false,
        },
        events: {
          updated: (chart, option) => {
            console.log(chart.options.yAxis);
            chart.options.yAxis = {
              ...chart.options.yAxis,
              min: 143.5,
              max: 146.5,
              tickAmount: 10,
              forceNiceScale: false,
            };
            console.log(chart.options.yAxis);
          },
        },
        animations: {
          enabled: false,
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#65eb3c",
            downward: "#c71919",
          },
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        min: 143.5,
        max: 146.5,
        tickAmount: 10,
        forceNiceScale: false,
      },
      tooltip: {
        enabled: false,
      },
    };

    this.chartBarOptions = {
      series: [
        {
          name: "volume",
          data: seriesDataLinear,
        },
      ],
      chart: {
        height: 160,
        type: "bar",
        brush: {
          enabled: true,
          target: "candles",
        },
        selection: {
          enabled: true,
          // xaxis: {
          //   min: data.volumns[data.volumns.length - 1].x.getTime(),
          //   max: data.volumns[0].x.getTime(),
          // },
          fill: {
            color: "#ccc",
            opacity: 0.4,
          },
          stroke: {
            color: "#0D47A1",
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        bar: {
          columnWidth: "80%",
          colors: {
            ranges: [
              {
                from: -1000,
                to: 0,
                color: "#F15B46",
              },
              {
                from: 1,
                to: 10000,
                color: "#FEB019",
              },
            ],
          },
        },
      },
      stroke: {
        width: 0,
      },
      xaxis: {
        type: "datetime",
        axisBorder: {
          offsetX: 13,
        },
      },
      yaxis: {
        labels: {
          show: true,
        },
      },
    };
  }
  ngOnInit(): void {
    console.log(this.chartBar);
  }
}
