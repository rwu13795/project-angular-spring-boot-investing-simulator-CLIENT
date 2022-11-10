import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { SharedModule } from "../shared/shared.module";
import { IndexChartComponent } from "./index-chart/index-chart.component";

import { IndexPreviewComponent } from "./index-preview/index-preview.component";
import { MarketIndexComponent } from "./market-index.component";

@NgModule({
  declarations: [
    IndexPreviewComponent,
    IndexChartComponent,
    MarketIndexComponent,
  ],
  imports: [CommonModule, RouterModule, NgApexchartsModule, SharedModule],
  exports: [
    CommonModule,
    RouterModule,
    NgApexchartsModule,
    IndexPreviewComponent,
    IndexChartComponent,
    MarketIndexComponent,
  ],
})
export class MarketIndexModule {}
