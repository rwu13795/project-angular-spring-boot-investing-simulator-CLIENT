import { Component, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ChartComponent,
  ApexTitleSubtitle,
  ApexTooltip,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

@Component({
  selector: "app-column-chart",
  templateUrl: "./column-chart.component.html",
  styleUrls: ["./column-chart.component.css"],
})
export class ColumnChartComponent {
  @ViewChild("column_chart") chart?: ChartComponent;
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Realized",
          data: [
            1.45, 5.42, 5.9, -0.42, -12.6, -18.1, -18.2, -14.16, -11.1, -6.09,
            0.34, 3.88, 13.07, 5.8, 2, 7.37, 8.1, 13.57, 15.75, 17.1, 19.8,
            -27.03, -54.4, -47.2, -43.3, -18.6, -48.6, -41.1, -39.6, -37.6,
            -29.4, -21.4, -2.4,
          ],
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        fontFamily: '"Quantico", sans-serif',
        toolbar: { show: false, tools: { zoom: false } },
      },
      plotOptions: {
        bar: {
          colors: {
            ranges: [
              {
                from: -Infinity,
                to: 0,
                color: "#F15B46",
              },
              {
                from: 0,
                to: Infinity,
                color: "#3ffe19",
              },
            ],
          },
          columnWidth: "80%",
        },
      },
      title: {
        text: "Sell",
        align: "left",
        style: {
          fontSize: "16px",
        },
      },
      tooltip: {
        enabled: true,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          let data = series[seriesIndex][dataPointIndex];
          console.log("data", data);
          return `<div style="padding: 0px;"> 
            <div style="background-color: #c5f8ff; padding: 6px 12px; text-align: center;">
              ---Date---
            </div>
            <div >
              Realized: <b>${data}</b>  
            </div> 
          </div>`;
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        labels: {
          formatter: function (y) {
            return y.toFixed(0) + "%";
          },
        },
      },
      xaxis: {
        type: "category",
        // categories: [
        //   "2011-01-01",
        //   "2011-02-01",
        //   "2011-03-01",
        //   "2011-04-01",
        //   "2011-05-01",
        //   "2011-06-01",
        //   "2011-07-01",
        //   "2011-08-01",
        //   "2011-09-01",
        //   "2011-10-01",
        //   "2011-11-01",
        //   "2011-12-01",
        //   "2012-01-01",
        //   "2012-02-01",
        //   "2012-03-01",
        //   "2012-04-01",
        //   "2012-05-01",
        //   "2012-06-01",
        //   "2012-07-01",
        //   "2012-08-01",
        //   "2012-09-01",
        //   "2012-10-01",
        //   "2012-11-01",
        //   "2012-12-01",
        //   "2013-01-01",
        //   "2013-02-01",
        //   "2013-03-01",
        //   "2013-04-01",
        //   "2013-05-01",
        //   "2013-06-01",
        //   "2013-07-01",
        //   "2013-08-01",
        //   "2013-09-01",
        // ],
        // labels: {
        //   rotate: -90,
        // },
      },
    };
  }
}
