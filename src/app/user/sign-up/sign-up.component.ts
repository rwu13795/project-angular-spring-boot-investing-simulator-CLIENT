import { Component, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  AuthErrorInField,
  InputField,
  InputFieldNames,
  InputFieldTouched,
  LoadingStatus_user,
} from "../user-models";
import {
  setLoadingStatus_user,
  signIn,
  clearAuthError,
  signUp,
} from "../user-state/user.actions";
import {
  selectAuthError,
  selectHasAuth,
  selectLoadingStatus_user,
} from "../user-state/user.selectors";
import { UserService } from "../user.service";

@Component({
  selector: "app-user-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css", "../user.common.css"],
})
export class SignUpComponent implements OnInit, OnDestroy {
  public inputError: InputField = {
    [InputFieldNames.email]: "",
    [InputFieldNames.password]: "",
    [InputFieldNames.confirm_password]: "",
  };
  public inputTouched: InputFieldTouched = {
    [InputFieldNames.email]: false,
    [InputFieldNames.password]: false,
    [InputFieldNames.confirm_password]: false,
  };
  public signUpForm = this.formBuilder.group({
    email: [
      "",
      [Validators.required, Validators.email, Validators.maxLength(30)],
    ],
    password: [
      "",
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    confirm_password: [
      "",
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });

  private authError$?: Subscription;
  private hasAuth$?: Subscription;
  private loadingStatus$?: Subscription;
  private notMatched: boolean = false;

  public hasAuth: boolean = false;
  public loadingStatus: LoadingStatus_user = LoadingStatus_user.idle;
  public authErrors: AuthErrorInField = {
    [InputFieldNames.email]: null,
    [InputFieldNames.password]: null,
    [InputFieldNames.confirm_password]: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authError$ = this.store.select(selectAuthError).subscribe((data) => {
      if (!data) return;
      this.authErrors[data.field] = data;
    });
    this.hasAuth$ = this.store.select(selectHasAuth).subscribe((hasAuth) => {
      console.log("------------sign up success------------");
      this.hasAuth = hasAuth;
      if (!hasAuth) return;
      this.router.navigate(["/user/portfolio"]);
    });
    this.loadingStatus$ = this.store
      .select(selectLoadingStatus_user)
      .subscribe((status) => (this.loadingStatus = status));
  }

  get InputFieldNames() {
    return InputFieldNames;
  }

  get LoadingStatus_user() {
    return LoadingStatus_user;
  }

  onSubmit() {
    const { email, password, confirm_password } = this.signUpForm.value;
    // compare password and confirm_password manually
    this.notMatched = this.passwordsNotMatched(password, confirm_password);

    const hasError = this.onSubmitErrorCheck();

    console.log("hasError", hasError);
    if (hasError || !email || !password || !confirm_password) return;

    this.store.dispatch(
      setLoadingStatus_user({ status: LoadingStatus_user.loading_auth })
    );
    this.store.dispatch(
      signUp({ email, password, confirmPassword: confirm_password })
    );
  }

  onInput(field: string) {
    const control = this.signUpForm.get(field);
    if (!control) return;

    this.userService.setInputErrorMessage(field, this.inputError, control);
    this.authErrors[field] = null;
    this.store.dispatch(clearAuthError());
  }

  onBlur(field: string) {
    const control = this.signUpForm.get(field);
    if (!control) return;
    this.inputTouched[field] = true;
    this.userService.setInputErrorMessage(field, this.inputError, control);
  }

  private onSubmitErrorCheck() {
    // ----- (2) ----- //
    let hasError: boolean = false;
    for (let key of Object.keys(this.inputError)) {
      const control = this.signUpForm.get(key);
      if (!control) return;
      this.setPasswordFieldsInvalid(key, control);

      if (control.invalid) hasError = true;
      control.markAsTouched();
      this.onBlur(key);
      this.userService.setInputErrorMessage(key, this.inputError, control);
    }
    return hasError;
  }

  // manually compare the passwords, if they do not match, use the
  // "control.setErrors" to manually set the field as invalid
  private passwordsNotMatched(
    password?: string | null,
    confirm_password?: string | null
  ) {
    if (!password || !confirm_password) return false;
    if (password !== confirm_password) {
      this.inputError[InputFieldNames.password] = "The passwords do not match";
      this.inputError[InputFieldNames.confirm_password] =
        "The passwords do not match";
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

  ngOnDestroy(): void {
    if (this.authError$) this.authError$.unsubscribe();
    if (this.hasAuth$) this.hasAuth$.unsubscribe();
    if (this.loadingStatus$) this.loadingStatus$.unsubscribe();
    this.store.dispatch(
      setLoadingStatus_user({ status: LoadingStatus_user.idle })
    );
  }
}
