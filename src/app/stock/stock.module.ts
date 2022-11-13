import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { NewsModule } from "../news/news.module";
import { PreviewListModule } from "../preview-list/preview-list.module";

import { SharedModule } from "../shared/shared.module";
import { CompanyProfileComponent } from "./company-profile/company-profile.component";
import { FinancialStatementsModule } from "./financial-statements/financial-statements.module";
import { FinancialSummaryComponent } from "./financial-summary/financial-summary.component";

import { AreaChartComponent } from "./stock-chart/area-chart/area-chart.component";
import { HistoricalChartComponent } from "./stock-chart/historical-chart/historical-chart.component";
import { MixedChartComponent } from "./stock-chart/mixed-chart/mixed-chart.component";
import { RealTimeChartComponent } from "./stock-chart/real-time-chart/real-time-chart.component";
import { RevenueChartComponent } from "./stock-chart/revenue-chart/revenue-chart.component";
import { StockChartComponent } from "./stock-chart/stock-chart.component";
import { StockMenuComponent } from "./stock-menu/stock-menu.component";
import { StockPriceComponent } from "./stock-price/stock-price.component";
import { StockRoutingModule } from "./stock-routing.module";
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
    FinancialSummaryComponent,
    CompanyProfileComponent,
    StockPriceComponent,
  ],
  imports: [
    RouterModule,
    NgApexchartsModule,
    CommonModule,
    StockRoutingModule,
    SharedModule,
    PreviewListModule,
    NewsModule,
    FinancialStatementsModule,
  ],
})
export class StockModule {}
