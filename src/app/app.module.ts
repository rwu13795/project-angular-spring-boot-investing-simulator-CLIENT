import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgApexchartsModule } from "ng-apexcharts";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CustomChartComponent } from "./chart/custom-chart.component";
import { DigitSlideComponent } from "./digit-slide/digit-slide.component";
import { HistoricalChartComponent } from "./stock/stock-chart/historical-chart/historical-chart.component";
import { StockChartComponent } from "./stock/stock-chart/stock-chart.component";
import { StockComponent } from "./stock/stock.component";
import { TestChartComponent } from "./test-chart/test-chart.component";
import { TestMixedChartComponent } from "./test-mixed-chart/test-mixed-chart.component";

@NgModule({
  declarations: [
    AppComponent,
    CustomChartComponent,
    DigitSlideComponent,
    StockComponent,
    StockChartComponent,
    TestChartComponent,
    TestMixedChartComponent,
    HistoricalChartComponent,
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
