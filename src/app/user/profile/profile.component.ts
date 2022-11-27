import { Component, OnInit, OnDestroy } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription, take } from "rxjs";

import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  AuthErrorInField,
  InputField,
  InputFieldNames,
  InputFieldTouched,
  LoadingStatus_user,
  UserInfo,
} from "../user-models";
import {
  setLoadingStatus_user,
  clearAuthError,
  changePassword,
} from "../user-state/user.actions";
import {
  selectAuthError,
  selectHasAuth,
  selectLoadingStatus_user,
  selectUserInfo,
} from "../user-state/user.selectors";
import { UserService } from "../user.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css", "../user.common.css"],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private authError$?: Subscription;
  private hasAuth$?: Subscription;
  private loadingStatus$?: Subscription;
  private notMatched: boolean = false;

  public inputError: InputField = {
    [InputFieldNames.password]: "",
    [InputFieldNames.new_password]: "",
    [InputFieldNames.confirm_password]: "",
  };
  public inputTouched: InputFieldTouched = {
    [InputFieldNames.password]: false,
    [InputFieldNames.new_password]: false,
    [InputFieldNames.confirm_password]: false,
  };
  public changePasswordForm = this.formBuilder.group({
    password: [
      "",
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    new_password: [
      "",
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    confirm_password: [
      "",
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });
  public loadingStatus: LoadingStatus_user = LoadingStatus_user.idle;
  public authErrors: AuthErrorInField = {
    [InputFieldNames.password]: null,
    [InputFieldNames.new_password]: null,
    [InputFieldNames.confirm_password]: null,
  };
  public userInfo: UserInfo | null = null;

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
      if (!hasAuth) this.router.navigate(["/"]);
    });
    this.loadingStatus$ = this.store
      .select(selectLoadingStatus_user)
      .subscribe((status) => {
        this.loadingStatus = status;
        if (this.loadingStatus === LoadingStatus_user.succeeded_auth) {
          this.changePasswordForm.reset();
          this.changePasswordForm.disable();
        }
      });

    this.store
      .select(selectUserInfo)
      .pipe(take(1))
      .subscribe((info) => {
        this.userInfo = info;
      });
  }

  get InputFieldNames() {
    return InputFieldNames;
  }

  get LoadingStatus_user() {
    return LoadingStatus_user;
  }

  onSubmit() {
    const { password, new_password, confirm_password } =
      this.changePasswordForm.value;
    // compare password and confirm_password manually
    this.notMatched = this.passwordsNotMatched(new_password, confirm_password);
    const hasError = this.onSubmitErrorCheck();

    if (
      hasError ||
      !password ||
      !new_password ||
      !confirm_password ||
      !this.userInfo
    )
      return;

    this.store.dispatch(
      setLoadingStatus_user({ status: LoadingStatus_user.loading_auth })
    );
    this.store.dispatch(
      changePassword({
        email: this.userInfo.email,
        password,
        new_password,
        confirm_password,
      })
    );
  }

  onInput(field: string) {
    const control = this.changePasswordForm.get(field);
    if (!control) return;

    this.userService.setInputErrorMessage(field, this.inputError, control);
    this.authErrors[field] = null;
    this.store.dispatch(clearAuthError());
  }

  onBlur(field: string) {
    const control = this.changePasswordForm.get(field);
    if (!control) return;
    this.inputTouched[field] = true;
    this.userService.setInputErrorMessage(field, this.inputError, control);
  }

  private onSubmitErrorCheck() {
    let hasError: boolean = false;
    for (let key of Object.keys(this.inputError)) {
      const control = this.changePasswordForm.get(key);
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
    new_password?: string | null,
    confirm_password?: string | null
  ) {
    if (!new_password || !confirm_password) return false;
    if (new_password !== confirm_password) {
      this.inputError[InputFieldNames.new_password] =
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
      (key === InputFieldNames.new_password ||
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
    this.store.dispatch(clearAuthError());
  }
}
