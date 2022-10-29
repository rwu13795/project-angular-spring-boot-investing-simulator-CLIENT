import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SignInComponent } from "./sign-in/sign-in.component";

@NgModule({
  declarations: [SignInComponent],
  imports: [
    //   RouterModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class AuthModule {}
