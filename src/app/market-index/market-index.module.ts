import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { SharedModule } from "../shared/shared.module";
import { IndexChartComponent } from "./index-chart/index-chart.component";
import { IndexListComponent } from "./index-list/index-list.component";
import { IndexPointComponent } from "./index-point/index-point.component";

import { IndexPreviewComponent } from "./index-preview/index-preview.component";
import { IndexSlideComponent } from "./index-slide/index-slide.component";
import { MarketIndexComponent } from "./market-index.component";

@NgModule({
  declarations: [
    IndexPreviewComponent,
    IndexChartComponent,
    IndexListComponent,
    IndexSlideComponent,
    IndexPointComponent,
    MarketIndexComponent,
  ],
  imports: [CommonModule, RouterModule, NgApexchartsModule, SharedModule],
  exports: [
    IndexPreviewComponent,
    IndexChartComponent,
    IndexListComponent,
    MarketIndexComponent,
    MarketIndexComponent,
  ],
})
export class MarketIndexModule {}
