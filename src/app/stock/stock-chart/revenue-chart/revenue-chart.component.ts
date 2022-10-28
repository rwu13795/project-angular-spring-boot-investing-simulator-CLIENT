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
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from "ng-apexcharts";
import { Subscription } from "rxjs";
import { Response_incomeStatement } from "../../financial-statements/financial-statements.models";
import { StockService } from "../../stock.service";
import { StockChartService } from "../stock-chart.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: "app-revenue-chart",
  templateUrl: "./revenue-chart.component.html",
  styleUrls: ["./revenue-chart.component.css"],
})
export class RevenueChartComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild("revenue-chart") chart!: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;

  @Input() symbol: string = "";
  private incomeStatement$?: Subscription;
  private isFullYear: boolean = true;

  constructor(
    private stockService: StockService,
    private stockChartService: StockChartService
  ) {}

  ngOnInit(): void {
    this.fetchChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fetchChartData();
  }

  ngOnDestroy(): void {
    if (this.incomeStatement$) this.incomeStatement$.unsubscribe();
  }

  private setChartOptions(data: Response_incomeStatement[]) {
    const xaxisCategories: string[] = [];
    const revenueData: number[] = [];
    const netIncomeData: number[] = [];

    for (let entry of data) {
      xaxisCategories.push(entry.date);
      revenueData.push(entry.revenue);
      netIncomeData.push(entry.netIncome);
    }

    this.chartOptions = {
      series: [
        { name: "Revenue", data: revenueData },
        { name: "Net Income", data: netIncomeData },
      ],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
          tools: { zoom: false },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: xaxisCategories,
        labels: {
          show: true,
          formatter: (val) => {
            return new Date(val).getFullYear().toString();
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
          formatter: (val) => {
            return this.stockChartService.toSignificantDigit(val);
          },
        },
      },

      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val) => {
            return "$" + this.stockChartService.toLocalString(val);
          },
        },
      },
    };
  }

  private fetchChartData() {
    this.incomeStatement$ = this.stockService
      .getIncomeStatements(this.symbol, this.isFullYear, 6)
      .subscribe((data) => this.setChartOptions(data));
  }
}
