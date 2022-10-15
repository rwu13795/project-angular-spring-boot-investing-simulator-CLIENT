import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { CompanyProfileComponent } from "./company-profile/company-profile.component";
import { FinancialStatementsComponent } from "./financial-statements/financial-statements.component";
import { FinancialStatementsModule } from "./financial-statements/financial-statements.module";
import { FinancialSummaryComponent } from "./financial-summary/financial-summary.component";
import { Stock404Component } from "./stock-404/stock-404.component";
import { AreaChartComponent } from "./stock-chart/area-chart/area-chart.component";

import { HistoricalChartComponent } from "./stock-chart/historical-chart/historical-chart.component";
import { MixedChartComponent } from "./stock-chart/mixed-chart/mixed-chart.component";
import { RealTimeChartComponent } from "./stock-chart/real-time-chart/real-time-chart.component";
import { RevenueChartComponent } from "./stock-chart/revenue-chart/revenue-chart.component";
import { StockChartComponent } from "./stock-chart/stock-chart.component";
import { StockMenuComponent } from "./stock-menu/stock-menu.component";
import { StockPriceComponent } from "./stock-price/stock-price.component";
import { StockRoutingModule } from "./stock-routing.module";
import { StockSearchComponent } from "./stock-search/stock-search.component";
import { StockComponent } from "./stock.component";

@NgModule({
  declarations: [
    HistoricalChartComponent,
    RealTimeChartComponent,
    MixedChartComponent,
    RevenueChartComponent,
    AreaChartComponent,
    StockChartComponent,
    StockMenuComponent,
    StockComponent,
    StockSearchComponent,
    FinancialSummaryComponent,
    CompanyProfileComponent,
    Stock404Component,
    StockPriceComponent,
  ],
  imports: [
    RouterModule,
    NgApexchartsModule,
    CommonModule,
    StockRoutingModule,
    FinancialStatementsModule,
  ],
})
export class StockModule {}
