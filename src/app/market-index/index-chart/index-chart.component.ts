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
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexMarkers,
  ApexStroke,
} from "ng-apexcharts";
import { Subscription } from "rxjs";
import { StockChartService } from "src/app/stock/stock-chart/stock-chart.service";
import { ChartData } from "src/app/stock/stock-models";
import { RealTimeIndex } from "../market-index-models";
import { MarketIndexService } from "../market-index.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  colors: any;
  toolbar: any;
};

@Component({
  selector: "app-index-chart",
  templateUrl: "./index-chart.component.html",
  styleUrls: ["./index-chart.component.css"],
})
export class IndexChartComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild("index_chart", { static: false }) chart!: ChartComponent;
  @Input() symbol: string = "";
  private chartData$?: Subscription;
  private normalSymbol: string = "";
  private option: string = "1D";

  public chartOptions?: Partial<ChartOptions>;
  public timeRange: string = "";
  public loading: boolean = true;
  // display the "placeholder" image on init, and only show loading spinner
  // for the subsequent changes
  public usePlaceHolder: boolean = true;

  constructor(
    private marketIndexService: MarketIndexService,
    private stockChartService: StockChartService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.loading = true;
    if (changes["symbol"].currentValue) this.fetchIndexHistory();
  }

  ngOnDestroy(): void {
    if (this.chartData$) this.chartData$.unsubscribe();
  }

  public onSelectDayRange(option: string) {
    this.loading = true;
    this.option = option;
    this.fetchIndexHistory();
  }

  private fetchIndexHistory() {
    this.chartData$ = this.marketIndexService
      .fetchIndexHistory(this.option, this.symbol)
      .subscribe((data) => {
        this.timeRange = `${data.candleLine[0].x.toLocaleDateString()} - ${data.candleLine[
          data.candleLine.length - 1
        ].x.toLocaleDateString()}`;

        this.normalSymbol = this.marketIndexService.getIndexNormalSymbol(
          this.symbol
        );

        this.setChartOptions(data);
        this.loading = false;
        this.usePlaceHolder = false;
      });
  }

  private setChartOptions(data: ChartData) {
    this.chartOptions = {
      series: [{ data: data.candleLine, name: this.normalSymbol }],
      chart: { type: "area", height: 550 },
      dataLabels: { enabled: false },
      markers: {
        size: 0,
      },
      yaxis: {
        axisBorder: {
          show: true,
          color: "blue",
          offsetX: -2,
        },
        labels: {
          show: true,
          style: { colors: "blue", fontWeight: "bold" },
          formatter: (value) => {
            return this.stockChartService.toLocalString(value);
          },
        },
      },
      xaxis: {
        type: "category",
        tickAmount: 6,
        labels: {
          show: true,
          style: { fontWeight: "bold" },
          formatter: (value) => {
            return new Date(value).toLocaleDateString();
          },
        },
      },
      tooltip: {
        x: {
          formatter: (value, options: any) => {
            const { w, seriesIndex, dataPointIndex } = options;
            const date =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex].x;
            return new Date(date).toLocaleString();
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
    };
  }
}

/*

(1) when the type of the "xaxis" is "category", is just the dataPointIndex
    number of the series, not the "x" date value. I have to extract the "date"
    by using the properties inside the options

*/
