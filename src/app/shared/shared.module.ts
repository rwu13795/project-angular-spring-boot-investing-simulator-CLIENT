import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { NewsComponent } from "./news/news.component";
import { Page404Component } from "./page-404/page-404.component";
import { DigitCylinderComponent } from "./digit-cylinder/digit-cylinder.component";
import { PreviewListModule } from "./preview-list/preview-list.module";

@NgModule({
  declarations: [Page404Component, NewsComponent, DigitCylinderComponent],
  imports: [CommonModule, RouterModule, PreviewListModule],
  exports: [
    CommonModule,
    RouterModule,
    Page404Component,
    NewsComponent,
    DigitCylinderComponent,
    PreviewListModule,
  ],
})
export class SharedModule {}
