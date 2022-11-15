import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";

import { NavigationBarComponent } from "../navigation/navigation-bar/navigation-bar.component";
import { SearchComponent } from "../navigation/search/search.component";
import { SharedModule } from "../shared/shared.module";
import { AccountMenuComponent } from "./account-menu/account-menu.component";

@NgModule({
  declarations: [NavigationBarComponent, SearchComponent, AccountMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    SharedModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    NavigationBarComponent,
    SearchComponent,
  ],
})
export class NavigationModule {}
