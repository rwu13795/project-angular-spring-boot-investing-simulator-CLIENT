import { Component, OnInit, OnDestroy } from "@angular/core";
import { Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, map, of, take } from "rxjs";
import {
  InputField,
  InputFieldNames,
  InputFieldTouched,
  AuthErrorInField,
} from "../user-models";
import { UserService } from "../user.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css", "../user.common.css"],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private countDownTimer?: any;
  private redirectTimer?: any;
  private notMatched: boolean = false;
  private email: string = "";

  public loadingToken: boolean = true;
  public isTokenValid: boolean = false;
  public expiration: number = 0;
  public minute: number = 0;
  public second: number = 0;
  public tokenExpired: boolean = false;
  public loadingAuth: boolean = false;
  public succeeded: boolean = false;

  public inputError: InputField = {
    [InputFieldNames.password]: "",
    [InputFieldNames.confirm_password]: "",
  };
  public inputTouched: InputFieldTouched = {
    [InputFieldNames.password]: false,
    [InputFieldNames.confirm_password]: false,
  };
  public resetPasswordForm = this.formBuilder.group({
    password: [
      "",
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    confirm_password: [
      "",
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });

  public authErrors: AuthErrorInField = {
    [InputFieldNames.password]: null,
    [InputFieldNames.confirm_password]: null,
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      // there are "+" symbols in the token string, but when the token is attached
      // as a param in the "href", the "+" will become empty spaces!??
      // Don't know which part goes wrong, I am certain that it is not on the
      // server side
      // So, I have to replace the empty spaces in the token with "+" in order
      // to make this token valid
      const temp: string = params["token"];
      if (!temp) return;
      const token = temp.replace(/\s/g, "+");

      this.userService
        .validateResetToken(token)
        .pipe(
          take(1),
          map(({ timestamp, email }) => {
            this.loadingToken = false;
            this.isTokenValid = true;
            this.expiration =
              new Date(timestamp).getTime() - Date.now();
            this.email = email;

            this.setCountDown();
          }),
          catchError((error) => {
            this.loadingToken = false;
            return of(null);
          })
        )
        .subscribe();
    });
  }

  onSubmit() {
    const { password, confirm_password } = this.resetPasswordForm.value;
    this.notMatched = this.passwordsNotMatched(password, confirm_password);
    const hasError = this.onSubmitErrorCheck();

    if (hasError || !password || !confirm_password) return;

    console.log(this.email);

    this.loadingAuth = true;
    this.userService
      .resetPassword({
        email: this.email,
        password,
        confirm_password,
      })
      .pipe(
        take(1),
        map(() => {
          this.loadingAuth = false;
          this.succeeded = true;
          this.resetPasswordForm.reset();
          this.resetPasswordForm.disable();
          this.redirectToSignIn();
          clearInterval(this.countDownTimer);
        }),
        catchError((error) => {
          this.loadingAuth = false;
          this.authErrors[error.error.field] = error.error;
          return of(null);
        })
      )
      .subscribe();
  }

  onInput(field: string) {
    const control = this.resetPasswordForm.get(field);
    if (!control) return;

    this.userService.setInputErrorMessage(field, this.inputError, control);
    this.authErrors[field] = null;
  }

  onBlur(field: string) {
    const control = this.resetPasswordForm.get(field);
    if (!control) return;
    this.inputTouched[field] = true;
    this.userService.setInputErrorMessage(field, this.inputError, control);
  }

  get InputFieldNames() {
    return InputFieldNames;
  }

  ngOnDestroy(): void {
    if (this.countDownTimer) clearInterval(this.countDownTimer);
    if (this.redirectTimer) clearTimeout(this.redirectTimer);
  }

  private onSubmitErrorCheck() {
    let hasError: boolean = false;
    for (let key of Object.keys(this.inputError)) {
      const control = this.resetPasswordForm.get(key);
      if (!control) return;
      this.setPasswordFieldsInvalid(key, control);

      if (control.invalid) hasError = true;
      control.markAsTouched();
      this.onBlur(key);
      this.userService.setInputErrorMessage(key, this.inputError, control);
    }
    return hasError;
  }

  private passwordsNotMatched(
    password?: string | null,
    confirm_password?: string | null
  ) {
    if (!password || !confirm_password) return false;
    if (password !== confirm_password) {
      this.inputError[InputFieldNames.password] =
        "The new passwords do not match";
      this.inputError[InputFieldNames.confirm_password] =
        "The new passwords do not match";
      return true;
    }
    return false;
  }

  private setPasswordFieldsInvalid(
    key: string,
    control: AbstractControl<any, any>
  ) {
    if (
      (key === InputFieldNames.password ||
        key === InputFieldNames.confirm_password) &&
      this.notMatched
    ) {
      control.setErrors({});
    }
  }

  private setCountDown() {
    this.minute = Math.floor(this.expiration / 60000);
    this.second = Math.floor((this.expiration % 60000) / 1000);

    this.countDownTimer = setInterval(() => {
      if (this.second > 0) {
        this.second--;
      } else {
        this.second = 59;
        this.minute--;
      }
      if (this.minute === 0 && this.second === 0) {
        clearInterval(this.countDownTimer);
        this.resetPasswordForm.reset();
        this.resetPasswordForm.disable();
        this.tokenExpired = true;
      }
    }, 1000);
  }

  private redirectToSignIn() {
    this.second = 10;
    this.countDownTimer = setInterval(() => {
      this.second--;
    }, 1000);
    this.redirectTimer = setTimeout(() => {
      this.router.navigate(["/user/sign-in"]);
    }, 10000);
  }
}
