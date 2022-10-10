// import { Component, OnInit, ViewChild } from "@angular/core";

// import {
//   ChartComponent,
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexYAxis,
//   ApexXAxis,
//   ApexPlotOptions,
//   ApexDataLabels,
//   ApexStroke,
// } from "ng-apexcharts";
// import { ChartData } from "../stock/stock.service";

// import { chartData, seriesData, seriesDataLinear } from "./ohlc";

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
//   yaxis: ApexYAxis;
//   plotOptions: ApexPlotOptions;
//   dataLabels: ApexDataLabels;
//   stroke: ApexStroke;
//   tooltip: ApexTooltip;
// };

// @Component({
//   selector: "app-test-chart",
//   templateUrl: "./test-chart.component.html",
//   styleUrls: ["./test-chart.component.css"],
// })
// export class TestChartComponent implements OnInit {
//   @ViewChild("chartCandle") chartCandle!: ChartComponent;
//   @ViewChild("chartBar") chartBar!: ChartComponent;
//   // public chartCandleOptions: Partial<ChartOptions>;
//   // public chartBarOptions: Partial<ChartOptions>;

//   // public data: ChartData = { volumns: [], candles: [] };
//   // public dataTimeMap: { [timestamp: number]: number } = {};
//   updateTimer?: any;
//   intialUpdate: boolean = true;

//   constructor() {
//     // for (let i = chartData.length - 1; i >= 0; i--) {
//     //   const { date, open, high, low, close, volume } = chartData[i];
//     //   this.data.candles.push({
//     //     x: new Date(date),
//     //     y: [open, high, low, close],
//     //   });
//     //   this.data.volumns.push({ x: new Date(date), y: volume });
//     //   this.dataTimeMap[date] = chartData.length - 1 - i;
//     // }
//     // this.chartCandleOptions = {
//     //   series: [
//     //     {
//     //       name: "candle",
//     //       data: this.data.candles,
//     //     },
//     //   ],
//     //   chart: {
//     //     type: "candlestick",
//     //     height: 500,
//     //     id: "candles",
//     //     toolbar: {
//     //       show: true,
//     //       tools: {
//     //         download: false,
//     //         selection: true,
//     //         zoom: true,
//     //         zoomin: true,
//     //         zoomout: true,
//     //         pan: true,
//     //         reset: true,
//     //       },
//     //     },
//     //     zoom: {
//     //       enabled: true,
//     //     },
//     //     events: {
//     //       // ---- (1) ---- //
//     //       updated: (chart, option) => {
//     //         if (this.intialUpdate) {
//     //           this.chartCandle.updateOptions({
//     //             yaxis: {
//     //               min: 144,
//     //               max: 146.5,
//     //               tickAmount: 10,
//     //               forceNiceScale: false,
//     //             },
//     //           });
//     //           this.intialUpdate = false;
//     //         }
//     //       },
//     //       zoomed: (chart, lastZoomValues) => {},
//     //       scrolled: (chart, lastZoomValues) => {},
//     //     },
//     //     animations: {
//     //       enabled: false,
//     //     },
//     //   },
//     //   plotOptions: {
//     //     candlestick: {
//     //       colors: {
//     //         upward: "#65eb3c",
//     //         downward: "#c71919",
//     //       },
//     //     },
//     //   },
//     //   xaxis: {
//     //     type: "datetime",
//     //   },
//     //   yaxis: {
//     //     min: 144,
//     //     max: 146.5,
//     //     tickAmount: 10,
//     //     forceNiceScale: false,
//     //   },
//     //   tooltip: {
//     //     enabled: true,
//     //   },
//     // };
//     // this.chartBarOptions = {
//     //   series: [
//     //     {
//     //       name: "volume",
//     //       data: this.data.volumns,
//     //     },
//     //   ],
//     //   chart: {
//     //     height: 300,
//     //     type: "bar",
//     //     brush: {
//     //       enabled: true,
//     //       target: "candles",
//     //     },
//     //     selection: {
//     //       enabled: true,
//     //       xaxis: {
//     //         min: 1664908620000,
//     //         max: 1664910480000,
//     //       },
//     //       // fill: {
//     //       //   color: "#ccc",
//     //       //   opacity: 0.4,
//     //       // },
//     //       // stroke: {
//     //       //   color: "#0D47A1",
//     //       // },
//     //     },
//     //     events: {
//     //       // selection: (chart, { xaxis, yaxis }) => {},
//     //       // ---- (2) ---- //
//     //       brushScrolled: (chart, options?) => {
//     //         this.chartCandle.updateOptions({
//     //           yaxis: {
//     //             min: 144,
//     //             max: 146.5,
//     //             tickAmount: 10,
//     //             forceNiceScale: false,
//     //           },
//     //         });
//     //       },
//     //     },
//     //   },
//     //   dataLabels: {
//     //     enabled: false,
//     //   },
//     //   plotOptions: {
//     //     bar: {
//     //       columnWidth: "80%",
//     //       colors: {
//     //         ranges: [
//     //           {
//     //             from: -1000,
//     //             to: 0,
//     //             color: "#F15B46",
//     //           },
//     //           {
//     //             from: 1,
//     //             to: 10000,
//     //             color: "#FEB019",
//     //           },
//     //         ],
//     //       },
//     //     },
//     //   },
//     //   stroke: {
//     //     width: 0,
//     //   },
//     //   xaxis: {
//     //     type: "datetime",
//     //     axisBorder: {
//     //       offsetX: 13,
//     //     },
//     //   },
//     //   yaxis: {
//     //     labels: {
//     //       show: true,
//     //     },
//     //   },
//     // };
//   }

//   ngOnInit(): void {
//     // console.log(this.chartBar);
//   }
// }

// /*

// (1) After the chart is loaded, I have to select a range of initial
//     data points in the volumnBar which will sync with the candleBar
//     by adding the option in the "chart" option

//         selection: {
//           enabled: true,
//           xaxis: {
//             min: 1664908620000,
//             max: 1664910480000,
//           },
//         },
//     But after the selection, the fuking default "forceNiceScale: false"
//     kicks in, and I have to set the "yaxis" option again!

//     I should set the "yaxis" option in the "selection" event, BUT
//     this "selection" event has a fukking bug, it will break
//     the "brushScrolled" sync!!!!

//     At the end, I have to set the "yaxis" option inside this
//     "updated" event !!

// (2) I need to set the "forceNiceScale: false" in yaxis, since
//     the "brushScrolled" has a default "forceNiceScale: true"
//     the "forceNiceScale" will always mess up the yasix scale !!!

// */
