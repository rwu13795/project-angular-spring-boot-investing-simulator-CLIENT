import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";

import { environment } from "src/environments/environment";
import {
  Response_authError,
  Response_Portfolio,
  UserAccount,
} from "../user-models";
import * as actions from "./user.actions";

@Injectable()
export class UserEffects {
  private SERVER_URL = environment.SERVER_URL;

  public getUserInfo = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getUserInfo),
      switchMap(() => {
        return this.http
          .get<UserAccount>(`${this.SERVER_URL}/auth/get-user-info`, {
            withCredentials: true,
          })
          .pipe(
            map((data) => {
              return actions.setUserAccount({ account: data });
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
            { email, password },
            { withCredentials: true }
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

  public userSignUp = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.signUp),
      switchMap(({ email, password, confirmPassword }) => {
        return this.http
          .post<UserAccount>(
            `${this.SERVER_URL}/auth/sign-up`,
            { email, password, confirmPassword },
            { withCredentials: true }
          )
          .pipe(
            map((data) => {
              return actions.setUserAccount({ account: data });
            }),
            catchError((errorRes: Response_authError) => {
              console.log(errorRes);
              return of(actions.setAuthError({ authError: errorRes.error }));
            })
          );
      })
    )
  );

  public userSignOut = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.signOut),
      switchMap(() => {
        return this.http
          .get<{ text: string }>(`${this.SERVER_URL}/auth/sign-out`, {
            withCredentials: true,
          })
          .pipe(
            map(({ text }) => {
              console.log(text);
              return actions.removeUserAuth();
            }),
            catchError((errorRes: Response_authError) => {
              console.log(errorRes);
              return of(actions.setAuthError({ authError: errorRes.error }));
            })
          );
      })
    )
  );

  public fetchPortfolio = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.fetchPortfolio),
      switchMap(() => {
        return this.http
          .get<Response_Portfolio>(`${this.SERVER_URL}/portfolio/`, {
            withCredentials: true,
          })
          .pipe(
            map((data) => {
              return actions.setPortfolio({ portfolio: data });
            }),
            catchError((error) => {
              console.log(error);
              return of(actions.setAuth({ hasAuth: false }));
            })
          );
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
