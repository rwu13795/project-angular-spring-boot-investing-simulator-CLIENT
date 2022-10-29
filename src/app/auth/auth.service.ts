import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { InputField, InputFieldNames } from "./auth-models";

@Injectable({ providedIn: "root" })
export class AuthService {
  public setInputErrorMessage(
    field: string,
    inputError: InputField,
    control: AbstractControl
  ) {
    if (control.errors) {
      // console.log(control.errors);
      if (control.errors["maxlength"]) {
        switch (field) {
          case InputFieldNames.email: {
            inputError[field] =
              "The email must be less than or equal to 30 characters";
            return;
          }
          case InputFieldNames.password:
          case InputFieldNames.confirm_password: {
            inputError[field] =
              "Password must be between 8 and 20 characters in length";
            return;
          }
          default:
            return;
        }
      }
      if (control.errors["minlength"]) {
        inputError[field] =
          "Password must be between 8 and 20 characters in length";
        return;
      }
      if (control.errors["email"]) {
        inputError[field] = "Invalid email";
        return;
      }
      if (control.errors["required"]) {
        inputError[field] = "Required field";
        return;
      }
    } else {
      inputError[field] = "";
    }
  }

  public signIn(email: string, password: string) {}
}
