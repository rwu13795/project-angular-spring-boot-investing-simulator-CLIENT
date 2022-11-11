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
  private incomeStatement$?: Subscription;
  private isFullYear: boolean = true;

  @ViewChild("revenue-chart") chart!: ChartComponent;
  @Input() symbol: string = "";

  public chartOptions?: Partial<ChartOptions>;
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
        fontFamily: '"Quantico", sans-serif',
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
      .subscribe((data) => {
        this.setChartOptions(data);
        this.loading = false;
      });
  }
}
