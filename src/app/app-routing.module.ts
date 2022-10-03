import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StockComponent } from "./stock/stock.component";

const routes: Routes = [{ path: "search", component: StockComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
