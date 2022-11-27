import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { catchError, map, of, take } from "rxjs";

import {
  AuthErrorInField,
  InputField,
  InputFieldNames,
  InputFieldTouched,
} from "../../user-models";
import { UserService } from "../../user.service";

@Component({
  selector: "app-reset-password-request",
  templateUrl: "./request-link.component.html",
  styleUrls: ["./request-link.component.css", "../../user.common.css"],
})
export class ResetPasswordRequestComponent implements OnInit, OnDestroy {
  public inputError: InputField = {
    [InputFieldNames.email]: "",
  };
  public inputTouched: InputFieldTouched = {
    [InputFieldNames.email]: false,
  };
  public resetRequestForm = this.formBuilder.group({
    email: [
      "",
      [Validators.required, Validators.email, Validators.maxLength(30)],
    ],
  });
  public authErrors: AuthErrorInField = {
    [InputFieldNames.email]: null,
  };
  public loading: boolean = false;
  public succeeded: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const email = this.resetRequestForm.value.email;
    const hasError = this.onSubmitErrorCheck();
    if (hasError || !email) return;

    this.loading = true;
    this.userService
      .getResetPasswordLink(email)
      .pipe(
        take(1),
        map(() => {
          this.loading = false;
          this.succeeded = true;
          this.resetRequestForm.disable();
        }),
        catchError((error) => {
          this.authErrors[error.error.field] = error.error;
          this.loading = false;
          return of(null);
        })
      )
      .subscribe();
  }

  onInput(field: string) {
    const control = this.resetRequestForm.get(field);
    if (!control) return;

    this.userService.setInputErrorMessage(field, this.inputError, control);
    this.authErrors[field] = null;
  }

  onBlur(field: string) {
    const control = this.resetRequestForm.get(field);
    if (!control) return;
    this.inputTouched[field] = true;
    this.userService.setInputErrorMessage(field, this.inputError, control);
  }

  private onSubmitErrorCheck() {
    let hasError: boolean = false;
    for (let key of Object.keys(this.inputError)) {
      const control = this.resetRequestForm.get(key);
      if (!control) return;

      if (control.invalid) hasError = true;
      control.markAsTouched();
      this.onBlur(key);
      this.userService.setInputErrorMessage(key, this.inputError, control);
    }
    return hasError;
  }

  get InputFieldNames() {
    return InputFieldNames;
  }

  ngOnDestroy(): void {}
}
