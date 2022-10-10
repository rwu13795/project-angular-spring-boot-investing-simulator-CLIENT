import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,
  ApexMarkers,
  ApexLegend,
} from "ng-apexcharts";
import { Subscription } from "rxjs";
import { ChartData, CandleData } from "../../stock-models";
import { StockService } from "../../stock.service";

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
  selector: "app-mixed-chart",
  templateUrl: "./mixed-chart.component.html",
  styleUrls: ["./mixed-chart.component.css"],
})
export class MixedChartComponent implements OnInit, OnDestroy {
  @ViewChild("chartCandle") chartCandle!: ChartComponent;
  @ViewChild("chartBar") chartBar!: ChartComponent;
  @Input() symbol: string = "";

  public chartCandleOptions?: Partial<ChartOptions>;
  public chartBarOptions?: Partial<ChartOptions>;
  public isLoading: boolean = true;
  public errorMessage?: string;

  private data$?: Subscription;
  private data: ChartData = {
    volumns: [],
    candles: [],
    candleLine: [],
    highBound: 0,
    lowBound: 0,
    currentTotalVolume: 0,
  };
  private realTimePrice$?: Subscription;
  public realTimePrice: number = 0;
  private firstRealTime: boolean = true;

  private updateTimer?: any;
  private intialUpdate: boolean = true;
  private newDataAdded: boolean = false;
  private dataUpdated: boolean = false;

  array = [
    [141.235, 141.2, 141.2989, 141.2499],
    [141.16, 141.15, 141.28, 141.2379],
    [141.12, 141.08, 141.17, 141.16],
    [141.12, 141.07, 141.14, 141.12],
  ];
  index = 0;
  lastXaxis: number[] = [];

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.data$ = this.stockService
      .fetchHistoryPrice("1D", this.symbol)
      .subscribe((data) => {
        if (data.candles.length === 0) {
          this.errorMessage = `Could not find any result for the symbol: ${this.symbol}`;
          this.isLoading = false;
          return;
        }
        this.data = data;
        this.realTimePrice = data.candleLine[data.candleLine.length - 1].y;

        this.setCandleOptions();
        this.setVolumnOptions();
        this.isLoading = false;
      });
  }

  addNewBar() {
    if (this.index > 3) {
      this.index = 0;
    }
    let yy = this.array[this.index];
    this.index++;

    let replaceTimestamp = this.data.candles[this.data.candles.length - 6].x;
    let lastTimestamp = this.data.candles[this.data.candles.length - 1].x;
    this.data.candles[this.data.candles.length - 6] = {
      x: replaceTimestamp,
      y: yy,
    };

    this.data.volumns[this.data.volumns.length - 6] = {
      x: replaceTimestamp,
      y: 45122,
    };

    this.data.candles.push({
      x: new Date(lastTimestamp.getTime() + 60000),
      y: [-1],
    });
    this.data.volumns.push({
      x: new Date(lastTimestamp.getTime() + 60000),
      y: 0,
    });
    // this.candleLine.push({
    //   x: replaceTimestamp,
    //   y: yy[3],
    // });

    // this.chartOptions.series = [
    //   {
    //     data: copy,
    //   },
    // ];

    // each upda
    this.chartCandle.updateSeries([
      { data: this.data.candles },
      { data: this.data.volumns },
    ]);

    this.chartBar.updateSeries([
      { data: this.data.candleLine },
      { data: this.data.volumns },
    ]);

    this.newDataAdded = true;
  }

  getRealTimePrice() {
    const lastDataPoint = this.data.candles[this.data.candles.length - 1];
    const secondLastDataPoint = this.data.candles[this.data.candles.length - 2];

    this.realTimePrice$ = this.stockService
      .getRealTimePrice()
      .subscribe(([data]) => {
        const { timestamp, volume, price } = data;
        const timestampMS = timestamp * 1000;

        console.log("price-------------", price);

        // if (timestampMS < lastDataPoint.x.getTime()) {
        //   console.log("timestampMS < lastDataPoint.x.getTime()");
        //   return;
        // }
        // for the chart "updated" event
        this.dataUpdated = true;

        if (this.firstRealTime) {
          this.firstRealTime = false;
          this.newDataAdded = true;

          console.log("firstRealTime");

          // The historical 1-min data is usually 1:30 min behind the real time price
          // timestamp, if I use the real-time time stamp, then there will be
          // irregular time-line on the chart, which makes the bar width changed in
          // a unpredictable way. I have to add each data point "x" using the
          // exact 1-min interval> Then in the tooltip, I will use the real-time
          // timestamp instead of the timestamp in "x"
          this.data.candles.push({
            x: new Date(timestampMS - 60000),
            y: [lastDataPoint.y[3], price, price, price],
          });
          this.data.volumns.push({
            x: new Date(timestampMS - 60000),
            y: volume - this.data.currentTotalVolume,
          });
          this.data.currentTotalVolume = volume;

          this.data.candleLine.push({
            x: new Date(timestampMS - 60000),
            y: price,
          });
        } else {
          // add new data point for every 1 min
          if (timestampMS - secondLastDataPoint.x.getTime() > 60000) {
            this.newDataAdded = true;
            console.log("adding");

            this.data.candles.push({
              x: new Date(lastDataPoint.x.getTime() + 60000),
              y: [lastDataPoint.y[3], price, price, price],
            });
            this.data.volumns.push({
              x: new Date(lastDataPoint.x.getTime() + 60000),
              y: volume - this.data.currentTotalVolume,
            });
            this.data.currentTotalVolume = volume;

            this.data.candleLine.push({
              x: new Date(lastDataPoint.x.getTime() + 60000),
              y: price,
            });
          } else {
            let [open, high, low, close] = lastDataPoint.y;
            if (price > high) high = price;
            if (price < low) low = price;

            console.log(open, high, low, close);

            this.data.candles[this.data.candles.length - 1] = {
              x: lastDataPoint.x,
              y: [open, high, low, price],
            };
            this.data.volumns[this.data.volumns.length - 1] = {
              x: lastDataPoint.x,
              y: volume - this.data.currentTotalVolume,
            };
            this.data.candleLine[this.data.candleLine.length - 1] = {
              x: lastDataPoint.x,
              y: price,
            };
          }
        }

        this.chartCandle.updateSeries([
          { data: this.data.candles },
          { data: this.data.volumns },
        ]);

        this.chartBar.updateSeries([
          { data: this.data.candleLine },
          { data: this.data.volumns },
        ]);
      });
  }

  private addNewDataPoint(
    timestampMS: number,
    lastDataPoint: CandleData,
    price: number,
    volume: number
  ) {
    this.data.candles.push({
      x: new Date(timestampMS),
      y: [lastDataPoint.y[3], price, price, price],
    });
    this.data.volumns.push({
      x: new Date(timestampMS),
      y: volume - this.data.currentTotalVolume,
    });
    this.data.currentTotalVolume = volume;

    this.data.candleLine.push({
      x: new Date(timestampMS),
      y: price,
    });
  }

  /** *************************
   *
   *  Set Candles Bars Options
   *
   * **************************/
  private setCandleOptions() {
    this.chartCandleOptions = {
      series: [
        {
          name: "candle",
          type: "candlestick",
          data: this.data.candles,
          color: "#00E396",
        },
        {
          name: "Volumns",
          type: "bar",
          data: this.data.volumns,
          color: "#0035e3",
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
          if (data.y[0] === -1) return "<span></span>";

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
        // y: {
        //   formatter: undefined,
        //   title: {
        //     formatter: (seriesName) => "",
        //   },
        // },
        // x: {
        //   formatter: (value, opts?) => {
        //     // the value is the MS timestamp, any date string or date object
        //     // will be automatically converted to timestamp

        //     return new Date(value).toLocaleTimeString();
        //   },
        // },
      },
      chart: {
        stacked: false,
        type: "candlestick",
        height: 500,
        id: "candles",
        toolbar: {
          show: false,
          tools: { zoom: false },
        },
        zoom: {
          enabled: true,
        },
        events: {
          // ---- (1) ---- //
          updated: (chart, options) => {
            if (!this.chartCandleOptions) return;

            if (this.intialUpdate) {
              this.intialUpdate = false;
              chart.updateOptions({
                yaxis: this.chartCandleOptions.yaxis,
              });

              console.log("intialUpdate");
            }
            if (this.dataUpdated) {
              this.dataUpdated = false;

              console.log("dataUpdated");
              chart.updateOptions({
                yaxis: this.chartCandleOptions.yaxis,
              });

              // ---- (3) ---- //
              if (this.newDataAdded) {
                this.newDataAdded = false;
                console.log("newDataAdded");

                const { min, max } = options.config.xaxis;
                if (min && max && min !== 0 && max !== 0) {
                  if (this.lastXaxis.length < 1) {
                    this.lastXaxis = [min + 60000, max + 60000];
                  } else {
                    this.lastXaxis = [
                      this.lastXaxis[0] + 60000,
                      this.lastXaxis[1] + 60000,
                    ];
                  }
                } else {
                  this.lastXaxis = [
                    this.lastXaxis[0] + 60000,
                    this.lastXaxis[1] + 60000,
                  ];
                }
              }

              // if (this.dataUpdated) {
              //   this.lastXaxis = [
              //     this.lastXaxis[0] - 60000,
              //     this.lastXaxis[1] - 60000,
              //   ];
              // }

              chart.zoomX(this.lastXaxis[0], this.lastXaxis[1]);
            }
          },
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
      legend: {
        show: true,
        labels: { useSeriesColors: true },
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: (val, opts) => {
            return new Date(val).toLocaleTimeString();
          },
        },
      },
      yaxis: [
        {
          seriesName: "candle",
          min: this.data.lowBound,
          max: this.data.highBound,
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
  }

  /** *************************
   *
   *  Set Volumns Bars Options
   *
   * **************************/
  private setVolumnOptions() {
    const selectionMinBound = this.data.candles.length > 30 ? 31 : 16;

    this.chartBarOptions = {
      series: [
        {
          name: "candleLine",
          type: "line",
          data: this.data.candleLine,
          color: "#00E396",
        },
        {
          name: "volume",
          type: "bar",
          data: this.data.volumns,
          color: "#0035e3",
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
            min: this.data.candles[
              this.data.candles.length - selectionMinBound
            ].x.getTime(),
            max:
              this.data.candles[this.data.candles.length - 1].x.getTime() +
              60000,
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
            if (this.chartCandleOptions) {
              this.chartCandle.updateOptions({
                yaxis: this.chartCandleOptions.yaxis,
              });
              // ---- (3) ---- //
              this.lastXaxis = [options.xaxis.min, options.xaxis.max];
            }
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
        width: [3, 1],
      },
      xaxis: {
        type: "datetime",
        // tickAmount: 5,
        labels: {
          show: false,
          // formatter: (val, opts) => {
          //   return new Date(val).toLocaleTimeString();
          // },
          // offsetX: 20,
        },
      },
      yaxis: [
        {
          seriesName: "candleLine",
          min: this.data.lowBound,
          max: this.data.highBound,
          forceNiceScale: false,
          labels: { show: false },
        },
        {
          seriesName: "volume",
          opposite: true,
          labels: { show: false },
          forceNiceScale: true,
        },
      ],
    };
  }

  private numberFormatter(value: number, decimal: number = 0): string {
    if (decimal === 0) {
      return Math.floor(value).toString();
    }
    return value.toString();
  }

  ngOnDestroy(): void {
    if (this.data$) this.data$.unsubscribe();
    if (this.realTimePrice$) this.realTimePrice$.unsubscribe();
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
    But after the "selection", the "yaxis" option will be set back to default!!
    I have to set the "yaxis" option again!

    I should set the "yaxis" option in the "selection" event, BUT
    this "selection" event has a fukking bug, it will break
    the "brushScrolled" sync!!!!

    At the end, I have to set the "yaxis" option inside this
    "updated" event!!

(2) I need to set the "forceNiceScale: false" in yaxis, since
    the "brushScrolled" will reset all the "yaxis" option to default !!!
   

(3) ---- Last Xaxis ----
        
    If the user did not use the "brushScroll" to scroll the chart
    the "xaxis" will be the latest "xaxis" inside the "updated" event
    options. If the user DID use the "brushScroll", the "xaxis" in the
    "updated" event options will be [0, 0], I will need to track
    the "xaxis" inside the "brushScrolled" event, and store them in the variable

*/
