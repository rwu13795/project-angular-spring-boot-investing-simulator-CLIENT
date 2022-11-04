import { Component, OnDestroy, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import {
  AuthError,
  InputField,
  InputFieldNames,
  InputFieldTouched,
  LoadingStatus_user,
  Response_authError,
} from "../user-models";
import { checkAuth, clearAuthError, signIn } from "../user-state/user.actions";
import {
  selectAuthError,
  selectHasAuth,
  selectLoadingStatus_user,
  selectUserAccount,
} from "../user-state/user.selectors";
import { UserService } from "../user.service";

interface AuthErrorInField {
  [field: string]: AuthError | null;
}

@Component({
  selector: "app-user-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit, OnDestroy {
  public inputError: InputField = {
    [InputFieldNames.email]: "",
    [InputFieldNames.password]: "",
  };
  public inputTouched: InputFieldTouched = {
    [InputFieldNames.email]: false,
    [InputFieldNames.password]: false,
  };
  public signInForm = this.formBuilder.group({
    email: [
      "",
      [Validators.required, Validators.email, Validators.maxLength(30)],
    ],
    password: [
      "",
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });

  public hasAuth = this.store.select(selectHasAuth);
  public account = this.store.select(selectUserAccount);
  public loadingStatus = this.store.select(selectLoadingStatus_user);
  public authErrors: AuthErrorInField = {
    [InputFieldNames.email]: null,
    [InputFieldNames.password]: null,
  };
  private authError$?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.authError$ = this.store.select(selectAuthError).subscribe((data) => {
      if (!data) return;
      this.authErrors[data.field] = data;
    });
  }

  get InputFieldNames() {
    return InputFieldNames;
  }

  get LoadingStatus_user() {
    return LoadingStatus_user;
  }

  checkAuth() {
    console.log("checking auth");
    this.store.dispatch(checkAuth());
  }

  onSubmit() {
    const { email, password } = this.signInForm.value;
    if (!email || !password) return;

    const hasError = this.onSubmitErrorCheck();
    if (hasError) {
      console.log("has input error !!");
      return;
    }
    console.log(email, password);
    this.store.dispatch(signIn({ email, password }));
  }

  onInput(field: string) {
    const control = this.signInForm.get(field);
    if (!control) return;
    // ----- (1) ----- //
    // if (field !== InputFieldNames.email) control.markAsTouched();
    this.userService.setInputErrorMessage(field, this.inputError, control);
    this.authErrors[field] = null;
    this.store.dispatch(clearAuthError());
  }

  onChange(field: string) {
    // mark the filed as touched when it is un-focus, then use the it to
    // display the error message if there is any
    this.inputTouched[field] = true;
  }

  private onSubmitErrorCheck() {
    // ----- (2) ----- //
    let hasError: boolean = false;
    for (let key of Object.keys(this.inputError)) {
      const control = this.signInForm.get(key);
      if (control) {
        if (control.invalid) hasError = true;
        control.markAsTouched();
        this.onChange(key);
        this.userService.setInputErrorMessage(key, this.inputError, control);
      }
    }
    return hasError;
  }

  ngOnDestroy(): void {
    if (this.authError$) this.authError$.unsubscribe();
  }

  // custom validator
  //   forbiddenNames(control: FormControl): { [s: string]: boolean } | null {
  //     if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
  //       return { nameIsForbidden: true };
  //     }
  //     return null;
  //   }
}

/*

// ----- (1) ----- //
If I don't mark the control as "touched" using this method, the input
put field won't be marked as "touched" until focus is out. This means that
if I put some input that causes error, I won't see the error color until
I am no longer focusing on the input field 


// ----- (2) ----- //
if user hit "enter" to submit, some of the field might not be touched. This
means that the field won't check the validity. I need to manually mark
all the fields as "touched" and check the validity

*/
