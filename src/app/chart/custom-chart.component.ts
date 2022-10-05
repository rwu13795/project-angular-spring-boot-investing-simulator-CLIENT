import { animate } from "@angular/animations";
import { Component, ViewChild } from "@angular/core";
import * as ApexCharts from "apexcharts";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { CandleData, ChartData } from "../stock/stock.service";
import { chartData, seriesData } from "../test-chart/ohlc";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
};

@Component({
  selector: "app-custom-chart",
  templateUrl: "./custom-chart.component.html",
  styleUrls: ["./custom-chart.component.css"],
})
export class CustomChartComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  month = 0;

  array = [
    [145.235, 145.2, 145.2989, 145.2499],

    [145.16, 145.15, 145.28, 145.2379],

    [145.12, 145.08, 145.17, 145.16],

    [145.12, 345.07, 45.14, 155.12],
  ];
  index = 0;

  lastZoom: number[] = [];

  dataData: CandleData[] = [];

  constructor() {
    const data: ChartData = { volumns: [], candles: [] };

    for (let i = chartData.length - 1; i >= 0; i--) {
      const { date, open, high, low, close, volume } = chartData[i];
      data.candles.push({
        x: new Date(date),
        y: [open, high, low, close],
      });
      data.volumns.push({ x: new Date(date), y: volume });
    }

    const lastEntryTime = data.candles[data.candles.length - 1].x;
    const timePlaceHolder = new Date(lastEntryTime).getTime();

    data.candles.push({
      x: new Date(timePlaceHolder + 60000 * 1),
      y: [""],
    });
    data.candles.push({
      x: new Date(timePlaceHolder + 60000 * 2),
      y: [""],
    });
    data.candles.push({
      x: new Date(timePlaceHolder + 60000 * 3),
      y: [""],
    });
    data.candles.push({
      x: new Date(timePlaceHolder + 60000 * 4),
      y: [""],
    });
    data.candles.push({
      x: new Date(timePlaceHolder + 60000 * 5),
      y: [""],
    });
    data.candles.push({
      x: new Date(timePlaceHolder + 60000 * 6),
      y: [""],
    });
    data.candles.push({
      x: new Date(timePlaceHolder + 60000 * 7),
      y: [""],
    });

    this.dataData = data.candles;

    this.chartOptions = {
      series: [
        {
          name: "candle",
          data: data.candles,
        },
      ],
      tooltip: {
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          // console.log(series, seriesIndex, dataPointIndex, w);
          const data =
            w.globals.initialSeries[seriesIndex].data[dataPointIndex];

          // don't show the tooltip for the "placeholder" data
          if (data.y[0] === "") return "<span></span>";

          return (
            "<div>" +
            "<div><b>Open</b>: " +
            data.y[0] +
            "</div>" +
            "<div><b>High</b>: " +
            data.y[1] +
            "</div>" +
            "<div><b>Low</b>: " +
            data.y[2] +
            "</div>" +
            "<div><b>Close</b>: " +
            data.y[3] +
            "</div>" +
            "</div>"
          );
        },
        enabled: true,
        y: {
          formatter: undefined,
          title: {
            formatter: (seriesName) => "",
          },
        },
        x: {
          formatter: (value, opts?) => {
            // the value is the MS timestamp, any date string or date object
            // will be automatically converted to timestamp

            return new Date(value).toLocaleTimeString();
          },
        },
      },

      chart: {
        type: "candlestick",

        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },

        height: 350,
        // animations: {
        //   enabled: false,
        // },
        events: {
          updated: (chart, option) => {
            // chart.zoomX({
            //   min: new Date(2017, 6, 1).getTime(),
            //   max: new Date(2018, 2, 1).getTime(),
            // });
            console.log("updated", option);
          },
          beforeResetZoom: (chart, opts) => {
            console.log("beforeResetZoom", opts);
            this.lastZoom = [];
          },
          zoomed: (chart, lastZoomValues) => {
            // because after the chart data is updated, the chart "zoom" will
            // be reset!! I have to manually save the last "xaxis"
            // when user use the "zoom in/out" button to zoom the chart
            // save the last "xaxis" so that after the chart is updated,
            // I can use the "lastZoom" to manually zoom to the last "xaxis"
            console.log(lastZoomValues);
            this.lastZoom = [
              lastZoomValues.xaxis.min,
              lastZoomValues.xaxis.max,
            ];
          },
          scrolled: (chart, lastZoomValues) => {
            // when user use the "pan" option to scroll the chart
            // save the last "pan" "xaxis"
            console.log(lastZoomValues);
            this.lastZoom = [
              lastZoomValues.xaxis.min,
              lastZoomValues.xaxis.max,
            ];
          },
          animationEnd: (chart, options) => {
            // after the initial drawing animation ended, set the chart
            // animation to false so the that the updating won't trigger
            // the drawing animation again
            chart.updateOptions({
              chart: {
                animations: {
                  enabled: false,
                },
              },
            });
          },
        },
      },
      title: {
        text: "CandleStick Chart",
        align: "left",
      },
      xaxis: {
        // -------- NOTE ---------- //
        /**
         * I need to set the type as "datetime" to enlarge the candle bars
         * automatically. Also, I need to add more "time-placeholder" at the
         * end and beginning of the data array, otherwise, the "pan" button
         * won't work if I zoom out to much
         */
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
        max: 147,
        min: 143,
        forceNiceScale: false,
        tickAmount: 10,
        axisBorder: {
          show: true,
          color: "#78909C",
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: true,
          color: "#78909C",
          width: 6,
          offsetX: 0,
          offsetY: 0,
        },
        // forceNiceScale: true,
      },
    };
  }

  public generateDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  addNewBar() {
    // let copy = [...this.chartOptions.series![0].data] as any[];
    // let lastDate = copy[copy.length - 1].x;
    // let newBarDate = copy[copy.length - 5].x;
    // copy[copy.length - 5] = {
    //   x: new Date(newBarDate).toLocaleString(),
    //   y: [6624.98, 6626, 6654.07, 6646],
    // };
    // copy.push({
    //   x: new Date(new Date(lastDate).getTime() + 1800000).toLocaleString(),
    //   y: ["", "", "", ""],
    // });

    // this.chartOptions.series = [
    //   {
    //     data: copy,
    //   },
    // ];

    // Use the "appendData()" method to add new data, the chart won't be reset
    console.log(this.chart);
    this.chart.appendData([
      {
        data: [
          {
            x: new Date(2018, 1, 1),
            y: [71.71, 64.15, 51.29, 83.04],
          },
        ],
      },
    ]);
    this.chart.updateOptions({ animate: true });
  }

  updateSameBar() {
    if (this.index > 3) {
      this.index = 0;
    }
    let yy = this.array[this.index];
    this.index++;

    let date = this.dataData[this.dataData.length - 7].x;
    let lastPlaceHolderTime = this.dataData[this.dataData.length - 1].x;
    this.dataData[this.dataData.length - 7] = {
      x: date,
      y: yy,
    };

    this.dataData.push({
      x: new Date(lastPlaceHolderTime).getTime() + 60000,
      y: [""],
    });

    this.month = this.month + 1;
    console.log(this.month);

    // this.chartOptions.series = [
    //   {
    //     data: copy,
    //   },
    // ];
    this.chart.updateSeries([
      {
        data: this.dataData,
      },
    ]);

    if (this.lastZoom.length > 0) {
      console.log("re-zoom", this.lastZoom);
      // the "60000" is the 1-min interval is exactly the next bar's "xaxis"
      this.chart.zoomX(this.lastZoom[0] + 60000, this.lastZoom[1] + 60000);
    }
  }
}
