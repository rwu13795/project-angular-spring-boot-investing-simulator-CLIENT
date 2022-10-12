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
  ApexLegend,
  ApexMarkers,
} from "ng-apexcharts";
import { Subscription } from "rxjs";
import { ChartData } from "../../stock-models";
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
  selector: "app-historical-chart",
  templateUrl: "./historical-chart.component.html",
  styleUrls: ["./historical-chart.component.css"],
})
export class HistoricalChartComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild("chartCandle") chartCandle!: ChartComponent;
  @ViewChild("chartBar") chartBar!: ChartComponent;
  public chartCandleOptions?: Partial<ChartOptions>;

  @Input() option: string = "5D";
  @Input() symbol: string = "";

  private data$?: Subscription;
  private data: ChartData = {
    volumes: [],
    candles: [],
    candleLine: [],
    highBound: 0,
    lowBound: 0,
    currentTotalVolume: 0,
  };

  constructor(
    private stockService: StockService,
    private stockChartService: StockChartService
  ) {}

  ngOnInit(): void {
    this.data$ = this.stockService
      .fetchHistoryPrice(this.option, this.symbol)
      .subscribe((data) => {
        this.data = data;
        this.setChartCandleOptions();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.option = changes["option"].currentValue;
    const storedData = this.stockService.getStoredChartDate(this.option);
    if (storedData) {
      console.log("storedData---- found");
      this.data = storedData;
      this.setChartCandleOptions();
      return;
    }

    this.data$ = this.stockService
      .fetchHistoryPrice(this.option, this.symbol)
      .subscribe((data) => {
        this.data = data;
        this.setChartCandleOptions();
      });
  }

  ngOnDestroy(): void {
    if (this.data$) this.data$.unsubscribe();
  }

  private setChartCandleOptions() {
    this.chartCandleOptions = {
      series: [
        {
          name: "Candles",
          type: "candlestick",
          data: this.data.candles,
          color: "#00b746",
        },
        {
          name: "Volumns",
          type: "bar",
          data: this.data.volumes,
          color: "#0035e3",
        },
      ],
      chart: {
        stacked: false,
        type: "candlestick",
        height: 500,
        id: "candles",
        toolbar: {
          show: true,
          tools: {
            // selection: true,
            zoomin: true,
            zoomout: true,
            zoom: true,
          },
        },
        // ---- (3) ---- //
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: false,
        },
        animations: { enabled: true },
      },
      tooltip: {
        shared: false,
        custom: ({ seriesIndex, dataPointIndex, w }) => {
          const data =
            w.globals.initialSeries[seriesIndex].data[dataPointIndex];

          return this.stockChartService.setCustomTooltip(data, seriesIndex);
        },
        enabled: true,
      },
      stroke: { width: [1, 1] },
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
        // ---- (1) ---- //
        type: "category",
        tickAmount: 5,
        labels: {
          formatter: (val, options) => {
            return new Date(val).toLocaleDateString();
          },
        },
        tickPlacement: "on",
        tooltip: {
          enabled: true,
          // ---- (2) ---- //
          formatter: (val, options: any) => {
            const { w, seriesIndex, dataPointIndex } = options;
            const date =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex].x;
            return new Date(date).toLocaleString();
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
          },
          title: {
            text: "Price",
            style: { color: "#00b746" },
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
            text: "Volume",
            style: { color: "#0035e3" },
          },
          tooltip: { enabled: false },
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
}

/*

(1) Have to use "category" type, if I use "datetime" for the time range
    which is more than 1 day, some ugly emtpy space between the time gap 
    will be rendered on the chart

(2) this library is so fucked up, the value passed to the formatter,
    when the type of the "xaxis" is "category", is just the dataPointIndex
    number of the series, not the "x" date value. I have to extract the "date"
    by using the properties inside the options

(3) When the type "xaxis" is set to "category", the bar width won't resize
    after zooming in!! NO SOLUTION !!    
    
    only in type: 'datetime', the column bar can be resized !!

*/
