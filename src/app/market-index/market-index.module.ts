import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { IndexPreviewComponent } from "./index-preview/index-preview.component";

@NgModule({
  declarations: [IndexPreviewComponent],
  imports: [CommonModule],
  exports: [CommonModule, IndexPreviewComponent],
})
export class MarketIndexModule {}
