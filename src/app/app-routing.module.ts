import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { SignInComponent } from "./auth/sign-in/sign-in.component";

import { HomeComponent } from "./home/home.component";
import { MarketIndexComponent } from "./market-index/market-index.component";
import { MarketIndexGuard } from "./market-index/market-index.guard";
import { Page404Component } from "./shared/page-404/page-404.component";
import { PreviewListLargeComponent } from "./shared/preview-list/large/preview-list-large.component";

const routes: Routes = [
  { path: "", pathMatch: "full", component: HomeComponent },

  {
    path: "stock",
    loadChildren: () =>
      import("./stock/stock.module").then((m) => m.StockModule),
  },

  { path: "market-index", component: MarketIndexComponent },
  {
    path: "market-index/:symbol",
    component: MarketIndexComponent,
    canActivate: [MarketIndexGuard],
  },

  { path: "performance", component: PreviewListLargeComponent },

  {
    path: "auth",
    component: SignInComponent,
    children: [{ path: "sign-in", component: SignInComponent }],
  },

  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
