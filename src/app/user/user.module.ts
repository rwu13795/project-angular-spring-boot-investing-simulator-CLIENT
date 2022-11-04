import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthRoutingModule } from "./user-routing.module";

import { UserComponent } from "./user.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";

@NgModule({
  declarations: [UserComponent, SignInComponent, SignUpComponent],
  imports: [RouterModule, CommonModule, ReactiveFormsModule, AuthRoutingModule],
})
export class UserModule {}
