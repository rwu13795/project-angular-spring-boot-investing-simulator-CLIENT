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
import { ChartData, VolumnData } from "../stock/stock.service";

import { chartData, seriesData, seriesDataLinear } from "../test-chart/ohlc";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
  legend: ApexLegend;
};

@Component({
  selector: "app-test-mixed-chart",
  templateUrl: "./test-mixed-chart.component.html",
  styleUrls: ["./test-mixed-chart.component.css"],
})
export class TestMixedChartComponent implements OnInit {
  @ViewChild("chartCandle") chartCandle!: ChartComponent;
  @ViewChild("chartBar") chartBar!: ChartComponent;
  public chartCandleOptions: Partial<ChartOptions>;
  public chartBarOptions: Partial<ChartOptions>;

  public data: ChartData = { volumns: [], candles: [] };
  public candleLine: VolumnData[] = [];

  updateTimer?: any;
  intialUpdate: boolean = true;
  newDataUpdate: boolean = false;

  array = [
    [145.235, 145.2, 145.2989, 145.2499],
    [145.16, 145.15, 145.28, 145.2379],
    [145.12, 145.08, 145.17, 145.16],
    [145.12, 145.07, 145.14, 145.12],
  ];
  index = 0;
  lastXaxis: number[] = [];

  constructor() {
    for (let i = chartData.length - 1; i >= 0; i--) {
      const { date, open, high, low, close, volume } = chartData[i];
      this.data.candles.push({
        x: new Date(date),
        y: [open, high, low, close],
      });
      this.data.volumns.push({ x: new Date(date), y: volume });
      this.candleLine.push({ x: new Date(date), y: close });
    }

    const lastTimestamp = this.data.candles[this.data.candles.length - 1]
      .x as Date;
    for (let i = 0; i < 8; i++) {
      this.data.candles.push({
        x: lastTimestamp.getTime() + 60000 * i,
        y: [""],
      });
      this.data.volumns.push({
        x: lastTimestamp.getTime() + 60000 * i,
        y: 0,
      });
    }

    /*************** Chart Candle Options ***************/
    this.chartCandleOptions = {
      series: [
        {
          name: "candle",
          type: "candlestick",
          data: this.data.candles,
        },
        {
          name: "Volumns",
          type: "bar",
          data: this.data.volumns,
        },
      ],
      tooltip: {
        // multiple series datapoint won't share the same tooltip
        shared: false,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          // "seriesIndex" is number of the of the series data, 0 is the
          // "candle", 1 is the "Volumns". ONLY useful when the tooltip is
          // shared between the series

          // console.log(series, seriesIndex, dataPointIndex, w);
          const data =
            w.globals.initialSeries[seriesIndex].data[dataPointIndex];

          // don't show the tooltip for the "placeholder" data
          if (data.y[0] === "") return "<span></span>";

          if (seriesIndex === 1) {
            if (data.y === 0) return "<span></span>";
            return `<div style='padding: 6px'><b>Volumns</b>: ${data.y}</div>`;
          }

          return (
            "<div style='padding: 6px;'>" +
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
        stacked: false,
        type: "candlestick",
        height: 500,
        id: "candles",
        toolbar: {
          show: false,
          tools: {
            selection: false,
            zoom: false,
          },
        },
        zoom: {
          enabled: true,
        },
        events: {
          // ---- (1) ---- //
          updated: (chart, options) => {
            if (this.intialUpdate) {
              this.chartCandle.updateOptions({
                yaxis: this.chartCandleOptions.yaxis,
              });
              this.intialUpdate = false;
            }
            if (this.newDataUpdate) {
              this.chartCandle.updateOptions({
                yaxis: this.chartCandleOptions.yaxis,
              });
              const { min, max } = options.config.xaxis;
              this.newDataUpdate = false;
              this.lastXaxis = [min, max];
            }
          },
          zoomed: (chart, lastZoomValues) => {},
          scrolled: (chart, lastZoomValues) => {},
        },
        animations: {
          enabled: false,
        },
      },
      stroke: {
        width: [1, 1],
      },
      plotOptions: {
        bar: {
          colors: {
            ranges: [
              {
                from: 0,
                to: 10000000000,
                color: "#0035e3",
              },
            ],
          },
        },
      },
      legend: {
        show: true,
        labels: {
          colors: ["#00E396", "#0035e3"],
          useSeriesColors: true,
        },
      },
      xaxis: {
        type: "datetime",
        // offsetX: -11,
        // offsetY: -11,
      },
      yaxis: [
        {
          seriesName: "candle",
          min: 144,
          max: 146.5,
          tickAmount: 10,
          forceNiceScale: false,
          axisTicks: { show: true, offsetX: -4 },
          axisBorder: {
            show: true,
            color: "#00E396",
            offsetX: -4,
          },
          labels: {
            style: { colors: "#00E396" },
            offsetX: -10,
          },
          title: {
            text: "Price",
            style: { color: "#00E396" },
          },
          tooltip: { enabled: false },
        },
        {
          seriesName: "Volumns",
          opposite: true,
          axisTicks: { show: true, offsetX: -8 },
          axisBorder: {
            show: true,
            color: "#0035e3",
            offsetX: -8,
          },

          labels: {
            style: { colors: "#0035e3" },
            offsetX: -20,
            formatter: (val, opts) => this.numberFormatter(val),
          },
          title: {
            text: "Volumns",
            style: { color: "#0035e3" },
          },
          tooltip: { enabled: false },
        },
      ],
    };

    /*************** Chart Bar Options ***************/
    this.chartBarOptions = {
      series: [
        {
          name: "volume",
          type: "bar",
          data: this.data.volumns,
        },
        {
          name: "candleLine",
          type: "line",
          data: this.candleLine,
        },
      ],
      chart: {
        height: 300,
        type: "bar",
        brush: {
          enabled: true,
          target: "candles",
        },
        selection: {
          enabled: true,
          xaxis: {
            min: 1664908620000,
            max: lastTimestamp.getTime() + 60000 * 7,
          },
          // fill: {
          //   color: "#ccc",
          //   opacity: 0.4,
          // },
          // stroke: {
          //   color: "#0D47A1",
          // },
        },
        events: {
          // selection: (chart, { xaxis, yaxis }) => {},
          // ---- (2) ---- //
          brushScrolled: (chart, options?) => {
            this.chartCandle.updateOptions({
              yaxis: this.chartCandleOptions.yaxis,
            });
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          columnWidth: "80%",
          colors: {
            ranges: [
              {
                from: 0,
                to: 10000000000,
                color: "#0035e3",
              },
            ],
          },
        },
      },
      stroke: {
        width: [1, 3],
      },
      xaxis: {
        type: "datetime",
        axisBorder: {
          offsetX: 13,
        },
      },
      yaxis: [
        {
          seriesName: "volume",
          labels: { show: false },
        },
        {
          seriesName: "candleLine",
          opposite: true,
          min: 144,
          max: 146.5,
          forceNiceScale: false,
          labels: { show: false },
        },
      ],
    };
  }

  ngOnInit(): void {
    // console.log(this.chartBar);
  }

  addNewBar() {
    if (this.index > 3) {
      this.index = 0;
    }
    let yy = this.array[this.index];
    this.index++;

    let replaceTimestamp = this.data.candles[this.data.candles.length - 7]
      .x as Date;
    let lastTimestamp = this.data.candles[this.data.candles.length - 1]
      .x as Date;
    this.data.candles[this.data.candles.length - 7] = {
      x: replaceTimestamp,
      y: yy,
    };

    this.data.volumns[this.data.volumns.length - 7] = {
      x: replaceTimestamp,
      y: 45122,
    };

    this.data.candles.push({
      x: new Date(lastTimestamp).getTime() + 60000,
      y: [""],
    });
    this.data.volumns.push({
      x: new Date(lastTimestamp).getTime() + 60000,
      y: 0,
    });
    this.candleLine.push({
      x: replaceTimestamp,
      y: yy[3],
    });

    // this.chartOptions.series = [
    //   {
    //     data: copy,
    //   },
    // ];
    this.chartCandle.updateSeries([
      { data: this.data.candles },
      { data: this.data.volumns },
    ]);

    this.chartBar.updateSeries([
      { data: this.data.volumns },
      { data: this.candleLine },
    ]);

    this.newDataUpdate = true;

    if (this.lastXaxis.length > 0) {
      console.log("lastXaxis", this.lastXaxis);
      // the "60000" is the 1-min interval is exactly the next bar's "xaxis"
      this.chartCandle.zoomX(
        this.lastXaxis[0] + 60000,
        this.lastXaxis[1] + 60000
      );
    }
  }

  private numberFormatter(value: number, decimal: number = 0): string {
    if (decimal === 0) {
      return Math.floor(value).toString();
    }
    return value.toString();
  }
}

/*

(1) After the chart is loaded, I have to select a range of initial
    data points in the volumnBar which will sync with the candleBar
    by adding the option in the "chart" option

        selection: {
          enabled: true,
          xaxis: {
            min: 1664908620000,
            max: 1664910480000,
          },
        }, 
    But after the selection, the fuking default "forceNiceScale: false"
    kicks in, and I have to set the "yaxis" option again!

    I should set the "yaxis" option in the "selection" event, BUT
    this "selection" event has a fukking bug, it will break
    the "brushScrolled" sync!!!!

    At the end, I have to set the "yaxis" option inside this
    "updated" event !!

(2) I need to set the "forceNiceScale: false" in yaxis, since
    the "brushScrolled" will reset all the "yaxis" option to default !!!
   
*/
