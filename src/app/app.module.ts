import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgApexchartsModule } from "ng-apexcharts";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CustomChartComponent } from "./chart/custom-chart.component";
import { DigitSlideComponent } from "./digit-slide/digit-slide.component";

@NgModule({
  declarations: [AppComponent, CustomChartComponent, DigitSlideComponent],
  imports: [BrowserModule, AppRoutingModule, NgApexchartsModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
