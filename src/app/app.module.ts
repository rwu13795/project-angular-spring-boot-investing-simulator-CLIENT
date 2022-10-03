import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgApexchartsModule } from "ng-apexcharts";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CustomChartComponent } from "./chart/custom-chart.component";
import { DigitSlideComponent } from "./digit-slide/digit-slide.component";
import { StockComponent } from "./stock/stock.component";

@NgModule({
  declarations: [
    AppComponent,
    CustomChartComponent,
    DigitSlideComponent,
    StockComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgApexchartsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
