import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgApexchartsModule } from "ng-apexcharts";

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreRouterConnectingModule } from "@ngrx/router-store";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { DigitCylinderComponent } from "./common/digit-cylinder/digit-cylinder.component";
import { HistoricalChartComponent } from "./stock/stock-chart/historical-chart/historical-chart.component";
import { StockChartComponent } from "./stock/stock-chart/stock-chart.component";
import { StockComponent } from "./stock/stock.component";
import { StockModule } from "./stock/stock.module";
import { appReducer } from "./ngrx-store/app.reducer";
import { environment } from "src/environments/environment.prod";

@NgModule({
  declarations: [AppComponent, DigitCylinderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgApexchartsModule,
    // ngrx store //
    StoreModule.forRoot(appReducer),
    StoreDevtoolsModule.instrument({
      name: "NgRx Shopping-List",
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
