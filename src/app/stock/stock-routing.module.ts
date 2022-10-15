import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CompanyProfileComponent } from "./company-profile/company-profile.component";
import { FinancialStatementsComponent } from "./financial-statements/financial-statements.component";
import { FinancialSummaryComponent } from "./financial-summary/financial-summary.component";
import { Stock404Component } from "./stock-404/stock-404.component";
import { StockChartComponent } from "./stock-chart/stock-chart.component";
import { StockSearchComponent } from "./stock-search/stock-search.component";
import { StockSearchGuard } from "./stock-search/stock-search.guard";
import { StockComponent } from "./stock.component";

const routes: Routes = [
  {
    path: "",
    component: StockComponent,
    children: [
      { path: "", component: StockSearchComponent },
      { path: "financial-summary", redirectTo: "" },
      {
        path: "financial-summary/:symbol",
        component: FinancialSummaryComponent,
        canActivate: [StockSearchGuard],
      },
      { path: "financial-statements", redirectTo: "" },
      {
        path: "financial-statements/:symbol",
        component: FinancialStatementsComponent,
        canActivate: [StockSearchGuard],
      },
      { path: "chart", redirectTo: "" },
      {
        path: "chart/:symbol",
        component: StockChartComponent,
        canActivate: [StockSearchGuard],
      },
      { path: "company-profile", redirectTo: "" },
      {
        path: "company-profile/:symbol",
        component: CompanyProfileComponent,
        canActivate: [StockSearchGuard],
      },
      { path: "no-result", redirectTo: "" },
      {
        path: "no-result/:symbol",
        component: Stock404Component,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockRoutingModule {}
