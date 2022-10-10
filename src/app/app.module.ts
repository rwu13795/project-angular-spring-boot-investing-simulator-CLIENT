import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgApexchartsModule } from "ng-apexcharts";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { DigitSlideComponent } from "./digit-slide/digit-slide.component";
import { HistoricalChartComponent } from "./stock/stock-chart/historical-chart/historical-chart.component";
import { StockChartComponent } from "./stock/stock-chart/stock-chart.component";
import { StockComponent } from "./stock/stock.component";
import { StockModule } from "./stock/stock.module";

@NgModule({
  declarations: [AppComponent, DigitSlideComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgApexchartsModule,
    // StockModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
