import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
  SimpleChanges,
} from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from "ng-apexcharts";

type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
};

@Component({
  selector: "app-overall-chart",
  templateUrl: "./overall-chart.component.html",
  styleUrls: ["./overall-chart.component.css"],
})
export class OverallChartComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild("overall_chart", { static: false }) chart!: ChartComponent;

  public chartOptions?: ChartOptions;

  constructor() {}

  ngOnInit(): void {
    this.setChartOption();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {}

  private setChartOption() {
    this.chartOptions = {
      series: [
        {
          name: "Total",
          data: [
            {
              x: 2011,
              y: 188.25,
            },
            {
              x: 2012,
              y: 332,
            },
            {
              x: 2013,
              y: -146.44,
            },
            {
              x: 2014,
              y: -169,
            },
            {
              x: 2015,
              y: -184.12,
            },
          ],
        },
      ],
      chart: {
        type: "area",
        width: 400,
        height: 350,
        fontFamily: '"Quantico", sans-serif',
        toolbar: { show: false, tools: { zoom: false } },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        area: {
          fillTo: "end",
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "Overall Realized Gain/Loss",
        align: "left",
        style: {
          fontSize: "16px",
        },
      },
      xaxis: {
        type: "category",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        tickAmount: 6,
        floating: false,
        labels: {
          style: {
            colors: "#6b6b6b",
          },
          offsetY: -7,
          offsetX: 0,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      fill: {
        opacity: 0.5,
      },
      tooltip: {
        x: {
          format: "yyyy",
        },
        y: {
          formatter: (value) => {
            const temp = value >= 0 ? value : value * -1;
            return `${value >= 0 ? "+" : "-"}$${temp}`;
          },
        },
        fixed: {
          enabled: false,
          position: "topRight",
        },
      },
      grid: {
        yaxis: {
          lines: {
            offsetX: -30,
          },
        },
        padding: {
          left: 20,
        },
      },
    };
  }
}
