import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgApexchartsModule } from "ng-apexcharts";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { EffectsModule } from "@ngrx/effects";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { appReducer } from "./ngrx-store/app.reducer";
import { environment } from "src/environments/environment.prod";
import { StockEffects } from "./stock/stock-state/stock.effects";
import { HomeComponent } from "./home/home.component";
import { SharedModule } from "./shared/shared.module";
import { NavigationModule } from "./navigation/navigation.module";

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgApexchartsModule,
    NavigationModule,
    SharedModule,
    // ngrx store //
    StoreModule.forRoot(appReducer),
    StoreDevtoolsModule.instrument({
      name: "NgRx Shopping-List",
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([StockEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
