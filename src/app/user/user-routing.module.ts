import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserComponent } from "./user.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { UserGuard } from "./guards/user.guard";
import { AuthGuard } from "./guards/auth.guard";
import { PortfolioComponent } from "./portfolio/portfolio.component";

const routes: Routes = [
  {
    path: "",
    component: UserComponent,
    children: [
      { path: "", component: SignInComponent, canActivate: [UserGuard] },
      { path: "sign-in", component: SignInComponent, canActivate: [UserGuard] },
      { path: "sign-up", component: SignUpComponent, canActivate: [UserGuard] },
      {
        path: "portfolio",
        component: PortfolioComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
