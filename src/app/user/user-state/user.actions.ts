import { createAction, props } from "@ngrx/store";
import { AuthError, LoadingStatus_user, UserAccount } from "../user-models";

export const getUserInfo = createAction("[User] Check User Authentication");

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

export const signOut = createAction("[User] User Sign Out");

export const setUserAccount = createAction(
  "[User] Set User Account",
  props<{ account: UserAccount }>()
);

export const setAuthError = createAction(
  "[User] Set User Auth Error",
  props<{ authError: AuthError }>()
);

export const removeUserAuth = createAction("[User] Remove User Auth ");

export const clearAuthError = createAction("[User] Clear Auth Error");

export const fetchPortfolio = createAction("[User] Fetch Portfolio");

export const setPortfolio = createAction(
  "[User] Set Portfolio",
  props<{ portfolio: string }>()
);

export const setLoadingStatus_user = createAction(
  "[User] Set Loading Status User",
  props<{ status: LoadingStatus_user }>()
);

export const toggleSignInModal = createAction(
  "[User] Toggle Sign In Modal",
  props<{ open: boolean }>()
);
