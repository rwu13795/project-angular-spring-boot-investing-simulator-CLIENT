import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthRoutingModule } from "./user-routing.module";
import { MatPaginatorModule } from "@angular/material/paginator";

import { SharedModule } from "../shared/shared.module";
import { UserComponent } from "./user.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { PortfolioPreviewComponent } from "./portfolio/portfolio-preview/portfolio-preview.component";
import { PortfolioComponent } from "./portfolio/portfolio.component";
import { SignInModalComponent } from "./sign-in/sign-in-modal/sign-in-modal.component";
import { UserProfileComponent } from "./profile/profile.component";
import { MatIconModule } from "@angular/material/icon";
import { AssetListComponent } from "./portfolio/asset-list/asset-list.component";
import { WatchListComponent } from "./portfolio/watch-list/watch-list.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SellShortTooltipComponent } from "./portfolio/sell-short-tooltip/sell-short-tooltip.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ResetPasswordRequestComponent } from "./reset-password/request-link/request-link.component";

@NgModule({
  declarations: [
    UserComponent,
    SignInComponent,
    SignUpComponent,
    PortfolioPreviewComponent,
    PortfolioComponent,
    AssetListComponent,
    WatchListComponent,
    SignInModalComponent,
    UserProfileComponent,
    SellShortTooltipComponent,
    ResetPasswordRequestComponent,
    ResetPasswordComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    AuthRoutingModule,
    SharedModule,
  ],
  exports: [
    UserComponent,
    SignInComponent,
    SignUpComponent,
    PortfolioPreviewComponent,
    PortfolioComponent,
    SignInModalComponent,
    UserProfileComponent,
  ],
})
export class UserModule {}
