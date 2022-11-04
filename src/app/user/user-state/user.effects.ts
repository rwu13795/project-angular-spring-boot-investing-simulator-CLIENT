import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";

import { environment } from "src/environments/environment";
import {
  Response_authError,
  Response_checkAuth,
  UserAccount,
} from "../user-models";
import * as actions from "./user.actions";

@Injectable()
export class UserEffects {
  private SERVER_URL = environment.SERVER_URL;

  public checkUserAuth = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.checkAuth),
      switchMap(() => {
        return this.http
          .get<Response_checkAuth>(`${this.SERVER_URL}/auth/check-auth`, {
            withCredentials: true,
          })
          .pipe(
            map((data) => {
              return actions.setAuth({ hasAuth: data.hasAuth });
            }),
            // set hasAuth to false whenever there is a error response
            catchError((error) => {
              console.log(error);
              // need to wrap error-handling action inside the of() to return
              // an observable
              return of(actions.setAuth({ hasAuth: false }));
            })
          );
      })
    )
  );

  public userSignIn = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.signIn),
      switchMap(({ email, password }) => {
        return this.http
          .post<UserAccount>(
            `${this.SERVER_URL}/auth/sign-in`,
            {
              email,
              password,
            },
            {
              withCredentials: true,
            }
          )
          .pipe(
            map((data) => {
              return actions.setUserAccount({ account: data });
            }),
            catchError((errorRes: Response_authError) => {
              console.log(errorRes);
              // need to wrap error-handling action inside the of() to return
              // an observable
              return of(actions.setAuthError({ authError: errorRes.error }));
            })
          );
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}

  private getErrorMessage(errorRes: HttpErrorResponse): string {
    console.log("HttpErrorResponse------------->", errorRes);

    let errorMessage = "An unknown error occurred!";
    if (!errorRes.error || !errorRes.error.error) {
      return errorMessage;
    }

    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS": {
        errorMessage = "This email exists already";
        break;
      }
      case "INVALID_PASSWORD": {
        errorMessage = "The password you provided is not correct";
        break;
      }
      case "EMAIL_NOT_FOUND": {
        errorMessage = "The email you provided does not exist in our record";
        break;
      }

      default:
        break;
    }

    return errorMessage;
  }
}
