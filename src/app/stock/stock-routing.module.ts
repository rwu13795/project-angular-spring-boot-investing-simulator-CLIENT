import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FinancialSummaryComponent } from "./financial-summary/financial-summary.component";
import { StockChartComponent } from "./stock-chart/stock-chart.component";
import { StockSearchComponent } from "./stock-search/stock-search.component";
import { StockComponent } from "./stock.component";

const routes: Routes = [
  {
    // ---- (2) ---- //
    path: "",
    component: StockComponent,
    //   canActivate: [AuthGuard],
    children: [
      { path: "", component: StockSearchComponent },
      { path: "financial-summary", redirectTo: "" },
      {
        path: "financial-summary/:symbol",
        component: FinancialSummaryComponent,
      },
      { path: "chart", redirectTo: "" },
      { path: "chart/:symbol", component: StockChartComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockRoutingModule {}
