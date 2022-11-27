import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";

import { environment } from "src/environments/environment";
import {
  LoadingStatus_user,
  Response_authError,
  Response_Portfolio,
  UserInfo,
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
          .get<UserInfo>(`${this.SERVER_URL}/auth/get-user-info`, {
            withCredentials: true,
          })
          .pipe(
            map((data) => {
              return actions.setUserInfo({ info: data });
            }),
            // set hasAuth to false whenever there is a error response
            catchError((error) => {
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
          .post<UserInfo>(
            `${this.SERVER_URL}/auth/sign-in`,
            { email, password },
            { withCredentials: true }
          )
          .pipe(
            map((data) => {
              return actions.setUserInfo({ info: data });
            }),
            catchError((errorRes: Response_authError) => {
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
      switchMap(({ email, password, confirm_password }) => {
        return this.http
          .post<UserInfo>(
            `${this.SERVER_URL}/auth/sign-up`,
            { email, password, confirm_password },
            { withCredentials: true }
          )
          .pipe(
            map((data) => {
              return actions.setUserInfo({ info: data });
            }),
            catchError((errorRes: Response_authError) => {
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
              return actions.removeUserAuth();
            }),
            catchError((errorRes: Response_authError) => {
              return of(actions.setAuthError({ authError: errorRes.error }));
            })
          );
      })
    )
  );

  public changePassword = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.changePassword),
      switchMap((body) => {
        return this.http
          .put(`${this.SERVER_URL}/auth/change-password`, body, {
            withCredentials: true,
          })
          .pipe(
            map(() => {
              return actions.setLoadingStatus_user({
                status: LoadingStatus_user.succeeded_auth,
              });
            }),
            catchError((errorRes: Response_authError) => {
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
              return of(actions.setAuth({ hasAuth: false }));
            })
          );
      })
    )
  );

  public addToWatchlist = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.addToWatchlist),
      switchMap(({ symbol, exchange }) => {
        // NOTE
        // in "POST" method, the 2nd option is the body, and the 3rd option is the
        // other options such as "withCredentials: true". DO NOT mess up the order!
        return this.http
          .post(
            `${this.SERVER_URL}/portfolio/watchlist`,
            { symbol, exchange },
            { withCredentials: true }
          )
          .pipe(
            map(() => {
              return actions.updateWatchlist({ symbol, isAdded: true });
            })
          );
      })
    )
  );

  public removeFromWatchlist = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.removeFromWatchlist),
      switchMap(({ symbol }) => {
        return this.http
          .delete(`${this.SERVER_URL}/portfolio/watchlist?symbol=${symbol}`, {
            withCredentials: true,
          })
          .pipe(
            map(() => {
              return actions.updateWatchlist({ symbol, isAdded: false });
            })
          );
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
