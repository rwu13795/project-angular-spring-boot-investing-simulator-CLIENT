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
import { MarketIndexModule } from "./market-index/market-index.module";
import { StockModule } from "./stock/stock.module";
import { LayoutModule } from "@angular/cdk/layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UserModule } from "./user/user.module";
import { UserEffects } from "./user/user-state/user.effects";
import { PreviewListModule } from "./preview-list/preview-list.module";
import { NewsModule } from "./news/news.module";
import { FooterComponent } from "./footer/footer.component";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [AppComponent, HomeComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgApexchartsModule,
    NavigationModule,
    LayoutModule,
    SharedModule,
    NewsModule,
    PreviewListModule,
    MarketIndexModule,
    MatTooltipModule,
    StockModule,
    UserModule,
    // ngrx store //
    StoreModule.forRoot(appReducer),
    StoreDevtoolsModule.instrument({
      name: "NgRx Shopping-List",
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([StockEffects, UserEffects]),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
