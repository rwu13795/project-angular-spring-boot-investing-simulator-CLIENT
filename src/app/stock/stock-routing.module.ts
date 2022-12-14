import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AssetDetailComponent } from "./asset-detail/asset-detail.component";
import { CompanyProfileComponent } from "./company-profile/company-profile.component";
import { FinancialStatementsComponent } from "./financial-statements/financial-statements.component";
import { FinancialSummaryComponent } from "./financial-summary/financial-summary.component";
import { StockChartComponent } from "./stock-chart/stock-chart.component";
import { StockRedirectComponent } from "./stock-redirect/stock-redirect.component";
import { StockComponent } from "./stock.component";
import { StockGuard } from "./stock.guard";

const routes: Routes = [
  {
    path: "",
    component: StockComponent,
    children: [
      { path: "", component: StockRedirectComponent },

      { path: "asset-detail", redirectTo: "" },
      {
        path: "asset-detail/:symbol",
        component: AssetDetailComponent,
        canActivate: [StockGuard],
      },

      { path: "financial-summary", redirectTo: "" },
      {
        path: "financial-summary/:symbol",
        component: FinancialSummaryComponent,
        canActivate: [StockGuard],
      },

      { path: "financial-statements", redirectTo: "" },
      {
        path: "financial-statements/:symbol",
        component: FinancialStatementsComponent,
        canActivate: [StockGuard],
      },

      { path: "chart", redirectTo: "" },
      {
        path: "chart/:symbol",
        component: StockChartComponent,
        canActivate: [StockGuard],
      },

      { path: "company-profile", redirectTo: "" },
      {
        path: "company-profile/:symbol",
        component: CompanyProfileComponent,
        canActivate: [StockGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockRoutingModule {}
