import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgApexchartsModule } from "ng-apexcharts";

import { HistoricalChartComponent } from "./stock-chart/historical-chart/historical-chart.component";
import { MixedChartComponent } from "./stock-chart/mixed-chart/mixed-chart.component";
import { StockChartComponent } from "./stock-chart/stock-chart.component";
import { StockComponent } from "./stock.component";

@NgModule({
  declarations: [
    HistoricalChartComponent,
    MixedChartComponent,
    StockChartComponent,
    StockComponent,
  ],
  imports: [NgApexchartsModule, BrowserModule],
})
export class StockModule {}
