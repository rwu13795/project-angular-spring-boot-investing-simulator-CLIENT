import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";

import { HistoricalChartComponent } from "./stock-chart/historical-chart/historical-chart.component";
import { MixedChartComponent } from "./stock-chart/mixed-chart/mixed-chart.component";
import { StockChartComponent } from "./stock-chart/stock-chart.component";
import { StockRoutingModule } from "./stock-routing.module";
import { StockSearchComponent } from "./stock-search/stock-search.component";
import { StockComponent } from "./stock.component";

@NgModule({
  declarations: [
    HistoricalChartComponent,
    MixedChartComponent,
    StockChartComponent,
    StockComponent,
    StockSearchComponent,
  ],
  imports: [RouterModule, NgApexchartsModule, CommonModule, StockRoutingModule],
})
export class StockModule {}