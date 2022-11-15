import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "src/app/ngrx-store/app.reducer";

import {
  AuthError,
  AuthErrorInField,
  InputField,
  InputFieldNames,
  InputFieldTouched,
  LoadingStatus_user,
  Response_authError,
} from "../user-models";
import {
  clearAuthError,
  setLoadingStatus_user,
  signIn,
} from "../user-state/user.actions";
import {
  selectAuthError,
  selectHasAuth,
  selectLoadingStatus_user,
  selectPortfolio,
  selectUserAccount,
} from "../user-state/user.selectors";
import { UserService } from "../user.service";

@Component({
  selector: "app-user-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css", "../user.common.css"],
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

  private authError$?: Subscription;
  private hasAuth$?: Subscription;
  private loadingStatus$?: Subscription;
  public hasAuth: boolean = false;
  public loadingStatus: LoadingStatus_user = LoadingStatus_user.idle;
  public authErrors: AuthErrorInField = {
    [InputFieldNames.email]: null,
    [InputFieldNames.password]: null,
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
      console.log("select hasAuth", hasAuth);
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
    const { email, password } = this.signInForm.value;

    const hasError = this.onSubmitErrorCheck();
    if (hasError || !email || !password) return;

    this.store.dispatch(
      setLoadingStatus_user({ status: LoadingStatus_user.loading_auth })
    );
    this.store.dispatch(signIn({ email, password }));
  }

  onInput(field: string) {
    const control = this.signInForm.get(field);
    if (!control) return;
    // // ----- (1) ----- //
    // // if (field !== InputFieldNames.email) control.markAsTouched();
    this.userService.setInputErrorMessage(field, this.inputError, control);
    this.authErrors[field] = null;
    this.store.dispatch(clearAuthError());
  }

  onBlur(field: string) {
    // Because I am checking the input error on every single input, I don't
    // want to display the error message until the focus is off. So I need
    // to manaully set the "touched" when "onBlur"
    const control = this.signInForm.get(field);
    if (!control) return;
    this.inputTouched[field] = true;
    this.userService.setInputErrorMessage(field, this.inputError, control);
  }

  private onSubmitErrorCheck() {
    // ----- (2) ----- //
    let hasError: boolean = false;
    for (let key of Object.keys(this.inputError)) {
      const control = this.signInForm.get(key);
      console.log(control);
      if (control) {
        if (control.invalid) hasError = true;
        control.markAsTouched();
        this.onBlur(key);
        this.userService.setInputErrorMessage(key, this.inputError, control);
      }
    }
    return hasError;
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

// custom validator
//   forbiddenNames(control: FormControl): { [s: string]: boolean } | null {
//     if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
//       return { nameIsForbidden: true };
//     }
//     return null;
//   }
