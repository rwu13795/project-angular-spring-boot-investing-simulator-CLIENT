import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { Page404Component } from "./page-404/page-404.component";
import { DigitCylinderComponent } from "./digit-cylinder/digit-cylinder.component";
import { GradientBreakComponent } from "./gradient-break/gradient-break.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { CustomButtonComponent } from "./custom-button/custom-button.component";

@NgModule({
  declarations: [
    Page404Component,
    DigitCylinderComponent,
    GradientBreakComponent,
    LoadingSpinnerComponent,
    CustomButtonComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    CommonModule,
    RouterModule,
    Page404Component,
    DigitCylinderComponent,
    GradientBreakComponent,
    LoadingSpinnerComponent,
    CustomButtonComponent,
  ],
})
export class SharedModule {}
