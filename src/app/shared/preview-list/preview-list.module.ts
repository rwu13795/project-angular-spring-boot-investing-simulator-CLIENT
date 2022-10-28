import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

import { PreviewLargeEntryComponent } from "./large/entry-large/entry-large.component";
import { PreviewListLargeComponent } from "./large/preview-list-large.component";
import { PreviewSmallEntryComponent } from "./small/entry-small/entry-small.component";
import { PreviewListSmallComponent } from "./small/preview-list-small.component";

@NgModule({
  declarations: [
    PreviewListLargeComponent,
    PreviewLargeEntryComponent,
    PreviewListSmallComponent,
    PreviewSmallEntryComponent,
  ],
  imports: [CommonModule, RouterModule, MatIconModule],
  exports: [PreviewListSmallComponent, PreviewListLargeComponent],
})
export class PreviewListModule {}
