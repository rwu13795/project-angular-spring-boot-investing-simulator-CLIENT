import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { InputField, InputFieldNames, InputFieldTouched } from "../auth-models";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-auth-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  get InputFieldNames() {
    return InputFieldNames;
  }

  onSubmit() {
    const { email, password } = this.signInForm.value;
    const hasError = this.onSubmitErrorCheck();
    if (hasError) {
      console.log("has error !!");
      return;
    }
    console.log(email, password);
  }

  onInput(field: string) {
    const control = this.signInForm.get(field);
    if (!control) return;
    // ----- (1) ----- //
    // if (field !== InputFieldNames.email) control.markAsTouched();
    this.authService.setInputErrorMessage(field, this.inputError, control);
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
        this.authService.setInputErrorMessage(key, this.inputError, control);
      }
    }
    return hasError;
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
