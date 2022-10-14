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
import { StockChartService } from "../stock-chart.service";

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
  selector: "app-real-time-chart",
  templateUrl: "./real-time-chart.component.html",
  styleUrls: ["./real-time-chart.component.css"],
})
export class RealTimeChartComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild("chartCandle") chartCandle!: ChartComponent;
  @Input() symbol: string = "";

  public chartCandleOptions?: Partial<ChartOptions>;
  public chartBarOptions?: Partial<ChartOptions>;
  public isLoading: boolean = true;
  public errorMessage?: string;

  private data$?: Subscription;
  private data: ChartData = {
    volumes: [],
    candles: [],
    candleLine: [],
    highBound: 0,
    lowBound: 0,
    currentTotalVolume: 0,
  };
  private realTimePrice$?: Subscription;
  public realTimePrice: number = 0;
  private firstRealTime: boolean = true;
  private currentMinVolume = 0;

  private updateTimer?: any;
  private newDataAdded: boolean = false;
  private dataUpdated: boolean = false;
  private lastXaxis: number[] = [];
  private showVolumes: boolean = true;
  private zoomedHighBound: number = 0;
  private zoomedLowBound: number = Infinity;
  private isZoomed: boolean = false;

  constructor(
    private stockService: StockService,
    private stockChartService: StockChartService
  ) {}

  ngOnInit(): void {
    this.getHistoricalData();
    this.setUpdateTimer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  getHistoricalData() {
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
        this.isLoading = false;
      });
  }

  getRealTimePrice() {
    if (new Date().getUTCHours() - 4 >= 16) return;

    const lastDataPoint = this.data.candles[this.data.candles.length - 1];
    const secondLastDataPoint = this.data.candles[this.data.candles.length - 2];

    this.realTimePrice$ = this.stockService
      .getRealTimePrice()
      .subscribe(([data]) => {
        const { timestamp, volume, price } = data;
        const timestampMS = timestamp * 1000;
        console.log("price-------------", price);

        this.realTimePrice = price;
        this.dataUpdated = true;
        this.updateChartBoundary(price);

        if (this.firstRealTime) {
          this.firstRealTime = false;
          this.newDataAdded = true;
          // --- (1) --- //
          this.data.candles.push({
            x: new Date(lastDataPoint.x.getTime() + 60000),
            y: [lastDataPoint.y[3], price, price, price, timestampMS],
          });
          this.data.volumes.push({
            x: new Date(lastDataPoint.x.getTime() + 60000),
            // --- (1) --- //
            y: (volume - this.data.currentTotalVolume) * 0.2,
          });

          this.data.currentTotalVolume = volume;
        } else {
          // add new data point for every 1 min
          // Use the timestamp in "x", since it is the real-time timestamp
          const slTimestamp = new Date(secondLastDataPoint.y[4]).getTime();
          if (timestampMS - slTimestamp > 60000) {
            this.newDataAdded = true;
            console.log("adding");
            this.currentMinVolume =
              volume - this.data.currentTotalVolume - this.currentMinVolume;

            this.data.candles.push({
              x: new Date(lastDataPoint.x.getTime() + 60000),
              y: [lastDataPoint.y[3], price, price, price, timestampMS],
            });
            this.data.volumes.push({
              x: new Date(lastDataPoint.x.getTime() + 60000),
              y: this.currentMinVolume,
            });

            this.data.currentTotalVolume = volume - this.currentMinVolume;
          } else {
            let [open, high, low, close] = lastDataPoint.y;
            if (price > high) high = price;
            if (price < low) low = price;

            this.currentMinVolume = volume - this.data.currentTotalVolume;

            this.data.candles[this.data.candles.length - 1] = {
              x: lastDataPoint.x,
              y: [open, high, low, price, timestampMS],
            };
            this.data.volumes[this.data.volumes.length - 1] = {
              x: lastDataPoint.x,
              y: this.currentMinVolume,
            };
          }
        }

        this.chartCandle.updateSeries([
          { data: this.data.candles },
          { data: this.data.volumes },
        ]);
      });
  }

  ngOnDestroy(): void {
    if (this.data$) this.data$.unsubscribe();
    if (this.realTimePrice$) this.realTimePrice$.unsubscribe();
    if (this.updateTimer) clearInterval(this.updateTimer);
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
          name: "Candles",
          type: "candlestick",
          data: this.data.candles,
          color: "#00b746",
        },
        {
          name: "Volumes",
          type: "bar",
          data: this.data.volumes,
          color: "#0035e3",
        },
      ],
      chart: {
        stacked: false,
        type: "candlestick",
        height: 580,
        id: "Candles",
        toolbar: {
          show: true,
          autoSelected: "zoom",
          tools: {
            zoom: true,
            selection: true,
            zoomin: true,
            zoomout: true,
            reset: true,
            download: false,
          },
        },
        zoom: {
          enabled: true,
        },
        events: {
          mounted: (chart, options) => {
            try {
              // zoom to the last 30 entries on mounted
              const minXaxis = this.data.candles.length - 30;
              this.lastXaxis = [
                this.data.candles[minXaxis < 0 ? 0 : minXaxis].x.getTime(),
                this.data.candles[this.data.candles.length - 1].x.getTime() +
                  60000 * 8,
              ];
              chart.zoomX(...this.lastXaxis);
            } catch (err) {
              console.log("zoomX false error...");
            }
          },
          updated: (chart, options) => {
            if (!this.chartCandleOptions) return;

            if (this.dataUpdated) {
              this.dataUpdated = false;
              if (!this.showVolumes) {
                chart.hideSeries("Volumes");
              }

              console.log("dataUpdated");
              chart.updateOptions({
                yaxis: this.chartCandleOptions.yaxis,
              });
              // ---- (3) ---- //
              if (this.newDataAdded) {
                this.newDataAdded = false;
                console.log("newDataAdded");

                const { min, max } = options.config.xaxis;
                // if (min && max && min !== 0 && max !== 0) {
                //   console.log("newDataAdded ------ min, max")
                //   if (this.lastXaxis.length < 1) {
                //     this.lastXaxis = [min + 60000, max + 60000];
                //   } else {
                //     this.lastXaxis = [
                //       this.lastXaxis[0] + 60000,
                //       this.lastXaxis[1] + 60000,
                //     ];
                //   }
                // } else {
                //   console.log("newDataAdded ------ !min && !max");
                //   this.lastXaxis = [
                //     this.lastXaxis[0] + 60000,
                //     this.lastXaxis[1] + 60000,
                //   ];
                // }
                const lastDataPointTimestamp =
                  this.data.candles[this.data.candles.length - 1].x.getTime();
                if (this.isZoomed && max >= lastDataPointTimestamp) {
                  // some unknown error occurs when I try to use zoomX(), but there
                  // is no issue found in the chart
                  console.log("zoomX to the new Data point");
                  try {
                    chart.zoomX(min + 60000, max + 60000);
                  } catch (err) {
                    console.log("zoomX false error...");
                  }
                } else {
                  console.log("User is in the middle of data, don't zoomX");
                }
              }
            }
          },
          // --- (2) --- //
          zoomed: (chart, { xaxis, yaxis }) => {
            // min and max is the timestamp related to the chart data time stamp
            const { min, max } = xaxis;
            this.isZoomed = true;
            if (!min || !max) {
              this.resetChartYaxis();
              return;
            }

            const [minDataPointIndex, maxDataPointIndex] =
              this.getMinMaxDataPointIndex(min, max);

            if (!minDataPointIndex || !maxDataPointIndex) {
              this.resetChartYaxis();
              return;
            }
            console.log("min----", this.data.candles[minDataPointIndex]);
            console.log("max----", this.data.candles[maxDataPointIndex]);

            this.updateZoomedHighLowBound(minDataPointIndex, maxDataPointIndex);
          },
          legendClick: (chartContext, seriesIndex, config) => {
            if (seriesIndex === 1) this.showVolumes = !this.showVolumes;
          },
        },
        animations: {
          enabled: false,
        },
      },
      tooltip: {
        enabled: true,
        // multiple series datapoint won't share the same tooltip
        shared: false,
        // for the crosshair label
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          // --- (4) --- //
          let data = series[1][dataPointIndex];
          if (seriesIndex === 0) {
            data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
            // --- (4) --- //
            if (!data) {
              data = this.data.candles[dataPointIndex];
            }
          }
          return this.stockChartService.setCustomTooltip(
            data,
            seriesIndex,
            "candles",
            true
          );
        },
        // y: {  formatter: ()=>{} }
        x: {
          formatter: (value, { dataPointIndex, w }) => {
            let timestamp = value;
            if (dataPointIndex && w && w.globals) {
              const candleData = w.globals.initialSeries[0].data;
              if (candleData.length > 0) {
                timestamp = candleData[dataPointIndex].y[4];
              }
            }
            return new Date(timestamp).toLocaleTimeString();
          },
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
          formatter: (value, timestamp?, opts?) => {
            return new Date(value).toLocaleTimeString();
          },
        },
      },
      yaxis: [
        {
          seriesName: "Candles",
          min: this.data.lowBound,
          max: this.data.highBound,
          tickAmount: 10,
          forceNiceScale: false,
          axisTicks: { show: true, offsetX: -4 },
          axisBorder: {
            show: true,
            color: "#00b746",
            offsetX: -4,
          },
          labels: {
            style: { colors: "#00b746" },
            offsetX: -10,
            formatter: (val, opts) => this.stockChartService.toLocalString(val),
          },
          title: {
            text: "Price",
            style: { color: "#00b746" },
          },
          crosshairs: { show: true },
          tooltip: { enabled: false },
        },
        {
          seriesName: "Volumes",
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
            formatter: (val, opts) =>
              this.stockChartService.toSignificantDigit(val),
          },
          title: {
            text: "Volume",
            style: { color: "#0035e3" },
          },
          tooltip: { enabled: false },
        },
      ],
    };
  }

  private setUpdateTimer(): void {
    if (!this.isMarketOpened()) return;

    this.updateTimer = setInterval(() => {
      if (this.updateTimer && this.realTimePrice$ && !this.isMarketOpened()) {
        clearInterval(this.updateTimer);
        this.realTimePrice$.unsubscribe();
        console.log("---------- 4PM market closed! ----------");
        return;
      }
      this.getRealTimePrice();
    }, 10000);
  }

  private isMarketOpened(): boolean {
    const UTCHours = new Date().getUTCHours();
    const UTCMinutes = new Date().getUTCMinutes();

    if (UTCHours < 13 || UTCHours >= 20) {
      return false;
    }
    if (UTCHours >= 13 && UTCHours < 14 && UTCMinutes < 30) {
      return false;
    }
    return true;
  }

  private resetChartYaxis() {
    this.isZoomed = false;
    if (this.chartCandleOptions) {
      console.log("resetting---------------------");
      (this.chartCandleOptions.yaxis as ApexYAxis[])[0].min =
        this.data.lowBound;
      (this.chartCandleOptions.yaxis as ApexYAxis[])[0].max =
        this.data.highBound;
      this.chartCandle.updateOptions({
        yaxis: this.chartCandleOptions.yaxis,
      });
    }
  }

  private getMinMaxDataPointIndex(min: number, max: number): number[] {
    const lastDataPointIndex = this.data.candles.length - 1;
    const lastDataPointTimestamp =
      this.data.candles[lastDataPointIndex].x.getTime();

    // --- (2A) --- //
    let minDataPointIndex: number =
      lastDataPointIndex -
      Math.ceil((lastDataPointTimestamp - min) / 60000) -
      4;
    let maxDataPointIndex: number = 0;

    if (lastDataPointTimestamp <= max) {
      maxDataPointIndex = this.data.candles.length - 1;
    } else {
      let indexDifference = (lastDataPointTimestamp - max) / 60000;
      maxDataPointIndex = lastDataPointIndex - Math.floor(indexDifference) + 4;
    }

    if (minDataPointIndex < 0) minDataPointIndex = 0;
    if (maxDataPointIndex > lastDataPointIndex)
      maxDataPointIndex = lastDataPointIndex;

    if (minDataPointIndex === 0 && maxDataPointIndex === lastDataPointIndex) {
      return [];
    }

    return [minDataPointIndex, maxDataPointIndex];
  }

  private updateZoomedHighLowBound(
    minDataPointIndex: number,
    maxDataPointIndex: number
  ): void {
    this.zoomedHighBound = 0;
    this.zoomedLowBound = Infinity;

    for (let i = minDataPointIndex; i <= maxDataPointIndex; i++) {
      let high = this.data.candles[i].y[1];
      let low = this.data.candles[i].y[2];

      if (high * 1.002 > this.zoomedHighBound) {
        this.zoomedHighBound = high * 1.002;
      }
      if (low * 0.998 < this.zoomedLowBound) {
        this.zoomedLowBound = low * 0.998;
      }
    }
    console.log(
      "updating min-max bound",
      this.zoomedLowBound,
      this.zoomedHighBound
    );

    if (this.chartCandleOptions) {
      this.updateChartsYaxis();
      this.chartCandle.updateOptions({
        yaxis: this.chartCandleOptions.yaxis,
      });
    }
  }

  private updateChartsYaxis() {
    if (!this.chartCandleOptions) return;
    if (this.isZoomed) {
      (this.chartCandleOptions.yaxis as ApexYAxis[])[0].min =
        this.zoomedLowBound;
      (this.chartCandleOptions.yaxis as ApexYAxis[])[0].max =
        this.zoomedHighBound;
    } else {
      (this.chartCandleOptions.yaxis as ApexYAxis[])[0].min =
        this.data.lowBound;
      (this.chartCandleOptions.yaxis as ApexYAxis[])[0].max =
        this.data.highBound;
    }
    // no need to use the "chart.updateOptions" method here, once I update
    // the series after adding the new data, the "updated" event will fire
  }

  private updateChartBoundary(price: number) {
    if (price * 1.002 > this.data.highBound) {
      this.data.highBound = price * 1.002;
      this.zoomedHighBound = price * 1.002;
      this.updateChartsYaxis();
    }
    if (price * 0.998 < this.data.lowBound) {
      this.data.lowBound = price * 0.998;
      this.zoomedLowBound = price * 0.998;
      this.updateChartsYaxis();
    }
  }
}

/*
  
  ----- Note -----
  
  // (1) //
  The historical 1-min data is usually 1-min or more behind the real time price
  timestamp, if I use the real-time time stamp, then there will be
  irregular time-line on the chart, which makes the bar width changed in
  a unpredictable way. I have to add each data point "x" using the
  exact 1-min interval. In the tooltip, I will use the real-time
  timestamp instead of the timestamp in "xaxix" by adding the real-time
  timestamp in the x:[] as fifth element, then use the formatter in
  the "tooltip.x" to extract this timestamp and use it as x-label
          
  the intraday historical data somehow does NOT include the additionall
  volumes that are presented in the real-time data
  Google "intraday volumes don't match"
  So I have to deduct some volumes from the first update, otherwise,
  the volume will fluctuate in an ugly way
  
  
  // (2) //
  Since there is no solution for updating the high/low price bound dynanmically
  in the mixed-chart, I had to find a workaround for this mess.
  
  In the noraml candles chart, If I use the toolbar to zoom in a certain portion
  of data points, the "zoomed" event in the chart will provide the relative 
  timestamp of those data points. I found a way to extract these "timestamp", and
  use them to find out the range of the currently zoomed data points that are displayed
  in the chart. Once I got the range, I could calculate the high/low price bound of 
  the data points in the current range, and then use the "updateOptions" method to
  update the "yaxis.min" and "yaxis.max" dynamically
  
  
  // (2A) //
  since each data point interval is 1-min, I can find out the index
  difference between the current max data point and the lastDataPoint
  by subtracting the lastDataPoint timestamp by the current xaxis.max

  
  // (3) //
  If the user did not use the "brushScroll" to scroll the chart
  the "xaxis" will be the latest "xaxis" inside the "updated" event
  options. If the user DID use the "brushScroll", the "xaxis" in the
  "updated" event options will be [0, 0], I will need to track
  the "xaxis" inside the "brushScrolled" event, and store them in the variable
  
  
  // (4) //
  "seriesIndex" is number of the of the series data, 0 is the
  "Candles", 1 is the "Volumes". ONLY useful when the tooltip is
  shared between the series
           
  if user toggle off the candles and use the scrollBrush, the candles
  data will be undefined in above, but the dataPointIndex is available
  so I have to use this dataPointIndex to find the current candle data point
  in the "this.data.candles"
  
  */
