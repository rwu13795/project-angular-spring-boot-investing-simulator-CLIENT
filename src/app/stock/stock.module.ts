import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { NewsModule } from "../news/news.module";
import { PreviewListModule } from "../preview-list/preview-list.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTooltipModule } from "@angular/material/tooltip";

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
import { AssetDetailComponent } from "./asset-detail/asset-detail.component";
import { OverallChartComponent } from "./stock-chart/overall-chart/overall-chart.component";
import { ColumnChartComponent } from "./stock-chart/column-chart/column-chart.component";
import { TransactionsComponent } from "./asset-detail/transaction/transactions.component";
import { MatPaginatorModule } from "@angular/material/paginator";

@NgModule({
  declarations: [
    HistoricalChartComponent,
    RealTimeChartComponent,
    MixedChartComponent,
    RevenueChartComponent,
    AreaChartComponent,
    StockChartComponent,
    OverallChartComponent,
    ColumnChartComponent,
    StockMenuComponent,
    StockComponent,
    FinancialSummaryComponent,
    CompanyProfileComponent,
    AssetDetailComponent,
    TransactionsComponent,
    StockPriceComponent,
  ],
  imports: [
    RouterModule,
    MatIconModule,
    NgApexchartsModule,
    MatTooltipModule,
    MatPaginatorModule,
    CommonModule,
    StockRoutingModule,
    SharedModule,
    PreviewListModule,
    NewsModule,
    FinancialStatementsModule,
  ],
})
export class StockModule {}
