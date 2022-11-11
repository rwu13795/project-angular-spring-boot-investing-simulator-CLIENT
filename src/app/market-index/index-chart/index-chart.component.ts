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
  @Input() dayOption: string = "1D";
  @Input() isPreview: boolean = false;
  @Input() chartHeight: number = 550;

  private chartData$?: Subscription;
  private normalSymbol: string = "";

  public chartOptions?: Partial<ChartOptions>;
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
    if (changes["dayOption"]) this.fetchIndexHistory();
    if (changes["symbol"]) {
      // reset the dayOption when symbol was changed
      this.dayOption = "1D";
      this.fetchIndexHistory();
    }
  }

  ngOnDestroy(): void {
    if (this.chartData$) this.chartData$.unsubscribe();
  }

  private fetchIndexHistory() {
    this.chartData$ = this.marketIndexService
      .fetchIndexHistory(this.dayOption, this.symbol, this.isPreview)
      .subscribe((data) => {
        const dateString = data.candleLine[0].x.toLocaleDateString();

        this.normalSymbol = this.marketIndexService.getIndexNormalSymbol(
          this.symbol
        );

        this.setChartOptions(data);
        this.marketIndexService.currentDate.emit(dateString);
        this.loading = false;
        this.usePlaceHolder = false;
      });
  }

  private setChartOptions(data: ChartData) {
    this.chartOptions = {
      series: [{ data: data.candleLine, name: this.normalSymbol }],
      chart: {
        type: "area",
        height: this.chartHeight,
        fontFamily: '"Quantico", sans-serif',
        toolbar: {
          show: !this.isPreview,
          tools: { zoom: true, download: false },
        },
      },
      dataLabels: { enabled: false },
      markers: {
        size: 0,
      },

      yaxis: {
        axisBorder: {
          show: true,
          color: "#005aa3",
          offsetX: -2,
        },
        labels: {
          show: true,
          style: { colors: "#005aa3", fontWeight: "bold" },
          formatter: (value) => {
            return this.stockChartService.toLocalString(value.toFixed(0));
          },
        },
      },
      xaxis: {
        type: "category",
        tickAmount: 6,
        labels: {
          show: true,
          style: {
            fontWeight: "bold",
            fontSize: this.isPreview ? "9px" : "12px",
          },
          formatter: (value) => {
            if (this.dayOption === "1D") {
              return new Date(value).toLocaleTimeString();
            }
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
