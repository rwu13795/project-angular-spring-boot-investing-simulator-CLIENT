import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

import { NewsComponent } from "./news/news.component";
import { Page404Component } from "./page-404/page-404.component";
import { DigitCylinderComponent } from "./digit-cylinder/digit-cylinder.component";
import { GradientBreakComponent } from "./gradient-break/gradient-break.component";
import { PreviewLargeEntryComponent } from "./preview-list/large/entry-large/entry-large.component";
import { PreviewListLargeComponent } from "./preview-list/large/preview-list-large.component";
import { PreviewSmallEntryComponent } from "./preview-list/small/entry-small/entry-small.component";
import { PreviewListSmallComponent } from "./preview-list/small/preview-list-small.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@NgModule({
  declarations: [
    Page404Component,
    NewsComponent,
    DigitCylinderComponent,
    GradientBreakComponent,
    PreviewListLargeComponent,
    PreviewLargeEntryComponent,
    PreviewListSmallComponent,
    PreviewSmallEntryComponent,
    LoadingSpinnerComponent,
  ],
  imports: [CommonModule, RouterModule, MatIconModule],
  exports: [
    CommonModule,
    RouterModule,
    Page404Component,
    NewsComponent,
    DigitCylinderComponent,
    GradientBreakComponent,
    PreviewListLargeComponent,
    PreviewLargeEntryComponent,
    PreviewListSmallComponent,
    PreviewSmallEntryComponent,
    LoadingSpinnerComponent,
  ],
})
export class SharedModule {}
