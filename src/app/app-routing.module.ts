import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { Page404Component } from "./shared/page-404/page-404.component";

const routes: Routes = [
  { path: "", pathMatch: "full", component: HomeComponent },
  {
    path: "stock",
    loadChildren: () =>
      import("./stock/stock.module").then((m) => m.StockModule),
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
