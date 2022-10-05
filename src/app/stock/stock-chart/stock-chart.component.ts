import { Component, Input, OnInit, ViewChild } from "@angular/core";

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
import { Subscription } from "rxjs";
import { CandleData, StockService, VolumnData } from "../stock.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
};

@Component({
  selector: "app-stock-chart",
  templateUrl: "./stock-chart.component.html",
  styleUrls: ["./stock-chart.component.css"],
})
export class StockChartComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartCandleOptions?: Partial<ChartOptions>;
  public chartBarOptions?: Partial<ChartOptions>;

  candleData: CandleData[] = [];
  volumnData: VolumnData[] = [];
  chartData$?: Subscription;

  constructor(private stockService: StockService) {
    // this.chartCandleOptions = {
    //   series: [
    //     {
    //       name: "candle",
    //       data: this.candleData,
    //     },
    //   ],
    //   chart: {
    //     type: "candlestick",
    //     height: 350,
    //     id: "candles",
    //     toolbar: {
    //       autoSelected: "pan",
    //       show: true,
    //     },
    //     zoom: {
    //       enabled: true,
    //     },
    //   },
    //   plotOptions: {
    //     candlestick: {
    //       colors: {
    //         upward: "green",
    //         downward: "red",
    //       },
    //     },
    //   },
    //   xaxis: {
    //     type: "datetime",
    //   },
    //   yaxis: {
    //     // min: 142,
    //     // max: 148,
    //     // tickAmount: 10,
    //     forceNiceScale: false,
    //   },
    // };
    // this.chartBarOptions = {
    //   series: [
    //     {
    //       name: "volume",
    //       data: [],
    //     },
    //   ],
    //   chart: {
    //     height: 160,
    //     type: "bar",
    //     brush: {
    //       enabled: true,
    //       target: "candles",
    //     },
    //     selection: {
    //       enabled: false,
    //       //   xaxis: {
    //       //     min: new Date().getTime() - 180000,
    //       //     max: new Date().getTime(),
    //       //   },
    //       //   fill: {
    //       //     color: "#ccc",
    //       //     opacity: 0.4,
    //       //   },
    //       //   stroke: {
    //       //     color: "#0D47A1",
    //       //   },
    //       // yaxis: {
    //       //   min: 142,
    //       //   max: 148,
    //       // },
    //     },
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   plotOptions: {
    //     bar: {
    //       columnWidth: "80%",
    //       colors: {
    //         ranges: [
    //           {
    //             from: -1000,
    //             to: 0,
    //             color: "#F15B46",
    //           },
    //           {
    //             from: 1,
    //             to: 10000,
    //             color: "#FEB019",
    //           },
    //         ],
    //       },
    //     },
    //   },
    //   stroke: {
    //     width: 0,
    //   },
    //   xaxis: {
    //     type: "datetime",
    //     axisBorder: {
    //       offsetX: 13,
    //     },
    //   },
    //   yaxis: {
    //     labels: {
    //       show: true,
    //     },
    //     forceNiceScale: false,
    //   },
    // };
  }
  ngOnInit(): void {
    this.fetchHistory();
  }

  fetchHistory() {
    this.chartData$ = this.stockService
      .fetchHistoryPrice()
      .subscribe((data) => {
        this.candleData = data.candles;
        this.volumnData = data.volumns;

        console.log(this.candleData);
        console.log(this.volumnData);

        // this.chartCandleOptions.series = [
        //   {
        //     name: "candle",
        //     data: this.candleData,
        //   },
        // ];

        // this.chartBarOptions.series = [
        //   {
        //     name: "volume",
        //     data: this.volumnData,
        //   },
        // ];

        // this.chartBarOptions.yaxis = {
        //   // min: 142,
        //   // max: 148,
        //   // tickAmount: 10,
        //   forceNiceScale: true,
        // };

        // this.chartCandleOptions.yaxis = {
        //   // min: 142,
        //   // max: 148,
        //   tickAmount: 10,
        //   forceNiceScale: true,
        // };
        this.chartCandleOptions = {
          series: [
            {
              name: "candle",
              data: this.candleData,
            },
          ],
          chart: {
            type: "candlestick",
            height: 350,
            id: "candles",
            toolbar: {
              autoSelected: "pan",
              show: true,
            },
            zoom: {
              enabled: true,
            },
          },
          plotOptions: {
            candlestick: {
              colors: {
                upward: "green",
                downward: "red",
              },
            },
          },
          xaxis: {
            type: "datetime",
          },
          yaxis: {
            min: 142,
            max: 148,
            tickAmount: 10,
            forceNiceScale: true,
          },
        };

        this.chartBarOptions = {
          series: [
            {
              name: "volume",
              data: this.volumnData,
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
              //   xaxis: {
              //     min: new Date().getTime() - 180000,
              //     max: new Date().getTime(),
              //   },
              //   fill: {
              //     color: "#ccc",
              //     opacity: 0.4,
              //   },
              //   stroke: {
              //     color: "#0D47A1",
              //   },
              // yaxis: {
              //   min: 142,
              //   max: 148,
              // },
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
            forceNiceScale: false,
          },
        };

        console.log(this.chartCandleOptions);
      });
  }

  ngOnDestroy(): void {
    if (this.chartData$) this.chartData$.unsubscribe();
  }
}
