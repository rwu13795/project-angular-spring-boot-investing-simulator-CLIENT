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
import { appReducer } from "./ngrx-store/app.reducer";
import { environment } from "src/environments/environment.prod";
import { EffectsModule } from "@ngrx/effects";
import { StockEffects } from "./stock/stock-state/stock.effects";
import { HeaderComponent } from "./common/header/header.component";
import { SearchComponent } from "./common/search/search.component";

@NgModule({
  declarations: [
    AppComponent,
    DigitCylinderComponent,
    HeaderComponent,
    SearchComponent,
  ],
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
    EffectsModule.forRoot([StockEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
