import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NavigationBarComponent } from "../navigation/navigation-bar/navigation-bar.component";
import { NewsComponent } from "./news/news.component";
import { Page404Component } from "./page-404/page-404.component";
import { SearchComponent } from "./search/search.component";

@NgModule({
  declarations: [
    Page404Component,
    SearchComponent,
    NavigationBarComponent,
    NewsComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    CommonModule,
    RouterModule,
    Page404Component,
    SearchComponent,
    NavigationBarComponent,
    NewsComponent,
  ],
})
export class SharedModule {}
