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
import { ChartData } from "../../stock-models";
import { StockService } from "../../stock.service";
import { StockChartService } from "../stock-chart.service";

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
  selector: "app-area-chart",
  templateUrl: "./area-chart.component.html",
  styleUrls: ["./area-chart.component.css"],
})
export class AreaChartComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild("area_chart", { static: false }) chart!: ChartComponent;
  @Input() symbol: string = "";
  private chartData$?: Subscription;
  public chartOptions?: Partial<ChartOptions>;
  public timeRange: string = "";
  public loading: boolean = true;

  constructor(
    private stockService: StockService,
    private stockChartService: StockChartService
  ) {}

  ngOnInit(): void {
    // since the chart is depending on the Input() symbol, I should fetch the
    // the data only after the symbol is updated in "ngOnChanges"
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fetchChartData();
  }

  ngOnDestroy(): void {
    if (this.chartData$) this.chartData$.unsubscribe();
  }

  private setChartOptions(data: ChartData) {
    this.chartOptions = {
      series: [{ data: data.candleLine, name: "Price" }],
      chart: {
        type: "area",
        height: 350,
        fontFamily: '"Quantico", sans-serif',
        toolbar: {
          show: false,
          tools: { zoom: false },
        },
      },
      dataLabels: { enabled: false },
      markers: {
        size: 0,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      yaxis: {
        labels: {
          show: true,
          formatter: (value) => {
            return this.stockChartService.toLocalString(value);
          },
        },
      },
      xaxis: {
        type: "category",
        tickAmount: 6,
        labels: {
          style: { fontSize: "10px" },
          show: true,
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

  private fetchChartData() {
    this.loading = true;
    this.chartData$ = this.stockService
      .fetchHistoryPrice("3M", this.symbol)
      .subscribe((data) => {
        const from = data.candleLine[0].x.toLocaleDateString();
        const to =
          data.candleLine[data.candleLine.length - 1].x.toLocaleDateString();
        this.timeRange = `${from} - ${to}`;

        this.setChartOptions(data);
        this.loading = false;
      });
  }
}

/*

(1) when the type of the "xaxis" is "category", is just the dataPointIndex
    number of the series, not the "x" date value. I have to extract the "date"
    by using the properties inside the options

*/
