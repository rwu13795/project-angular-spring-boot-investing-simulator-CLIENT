import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { MarketIndexComponent } from "./market-index/market-index.component";
import { MarketIndexGuard } from "./market-index/market-index.guard";
import { PreviewListLargeComponent } from "./preview-list/large/preview-list-large.component";
import { Page404Component } from "./shared/page-404/page-404.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent,
    title: "Trading-Simulator",
  },

  {
    path: "stock",
    loadChildren: () =>
      import("./stock/stock.module").then((m) => m.StockModule),
    title: "Stock",
  },

  {
    path: "user",
    loadChildren: () => import("./user/user.module").then((m) => m.UserModule),
    title: "User",
  },

  {
    path: "market-index",
    component: MarketIndexComponent,
    title: "Market Index",
  },
  {
    path: "market-index/:symbol",
    component: MarketIndexComponent,
    canActivate: [MarketIndexGuard],
    title: "Market Index",
  },

  {
    path: "performance",
    component: PreviewListLargeComponent,
    title: "Performance",
  },

  {
    path: "no-result/stock/:symbol",
    component: Page404Component,
    title: "No Result",
  },

  { path: "**", component: Page404Component, title: "Nothing to see here!" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
