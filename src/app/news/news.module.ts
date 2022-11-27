import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../shared/shared.module";
import { NewsComponent } from "./news.component";

@NgModule({
  declarations: [NewsComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [NewsComponent],
})
export class NewsModule {}
