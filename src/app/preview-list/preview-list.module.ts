import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { PreviewSmallEntryComponent } from "./small/entry-small/entry-small.component";
import { PreviewListSmallComponent } from "./small/preview-list-small.component";
import { PreviewLargeEntryComponent } from "./large/entry-large/entry-large.component";
import { PreviewListLargeComponent } from "./large/preview-list-large.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    PreviewListLargeComponent,
    PreviewListSmallComponent,
    PreviewLargeEntryComponent,
    PreviewSmallEntryComponent,
  ],
  imports: [CommonModule, RouterModule, MatIconModule, SharedModule],
  exports: [PreviewListLargeComponent, PreviewListSmallComponent],
})
export class PreviewListModule {}
