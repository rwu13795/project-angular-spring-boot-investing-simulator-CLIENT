import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";

import { NavigationBarComponent } from "../navigation/navigation-bar/navigation-bar.component";
import { SearchComponent } from "../navigation/search/search.component";

@NgModule({
  declarations: [NavigationBarComponent, SearchComponent],
  imports: [CommonModule, RouterModule, MatTooltipModule, MatIconModule],
  exports: [
    CommonModule,
    RouterModule,
    NavigationBarComponent,
    SearchComponent,
  ],
})
export class NavigationModule {}
