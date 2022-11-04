import { createAction, props } from "@ngrx/store";
import { AuthError, Response_authError, UserAccount } from "../user-models";

export const checkAuth = createAction("[User] Check Authentication");

export const setAuth = createAction(
  "[User] Set Authentication",
  props<{ hasAuth: boolean }>()
);

export const signIn = createAction(
  "[User] User Sign In",
  props<{ email: string; password: string }>()
);

export const signUp = createAction(
  "[User] User Sign Up",
  props<{ email: string; password: string; confirmPassword: string }>()
);

export const setUserAccount = createAction(
  "[User] Sst User Account",
  props<{ account: UserAccount }>()
);

export const setAuthError = createAction(
  "[User] Sst User Auth Error",
  props<{ authError: AuthError }>()
);

export const clearAuthError = createAction("[User] Clear Auth Error");
