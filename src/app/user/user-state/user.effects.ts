import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";

import { environment } from "src/environments/environment";
import { Response_authError, UserAccount } from "../user-models";
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

  public fetchPortfolio = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.fetchPortfolio),
      switchMap(() => {
        return this.http
          .get<{ res: string }>(`${this.SERVER_URL}/portfolio/get-portfolio`, {
            withCredentials: true,
          })
          .pipe(
            map((data) => {
              return actions.setPortfolio({ portfolio: data.res });
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
