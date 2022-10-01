import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgApexchartsModule } from "ng-apexcharts";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CustomChartComponent } from "./chart/custom-chart.component";

@NgModule({
  declarations: [AppComponent, CustomChartComponent],
  imports: [BrowserModule, AppRoutingModule, NgApexchartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
