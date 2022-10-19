import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { NavigationBarComponent } from "../navigation/navigation-bar/navigation-bar.component";
import { SearchComponent } from "../navigation/search/search.component";

@NgModule({
  declarations: [NavigationBarComponent, SearchComponent],
  imports: [CommonModule, RouterModule],
  exports: [
    CommonModule,
    RouterModule,
    NavigationBarComponent,
    SearchComponent,
  ],
})
export class NavigationModule {}
