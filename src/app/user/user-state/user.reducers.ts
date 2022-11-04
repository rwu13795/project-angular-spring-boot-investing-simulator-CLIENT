import { createReducer, on } from "@ngrx/store";
import produce from "immer";
import {
  AuthError,
  LoadingStatus_user,
  Response_authError,
  UserAccount,
} from "../user-models";

import * as actions from "./user.actions";

export interface UserState {
  loadingStatus: LoadingStatus_user;
  hasAuth: boolean;
  account: UserAccount;
  authError: AuthError | null;
}

const initialState: UserState = {
  loadingStatus: LoadingStatus_user.loading_auth,
  hasAuth: false,
  account: { id: -1, email: "", fund: 0 },
  authError: null,
};

export const userReducer = createReducer(
  { ...initialState },

  on(actions.setAuth, (state, { hasAuth }) =>
    produce(state, (draft) => {
      draft.hasAuth = hasAuth;
    })
  ),

  on(actions.setUserAccount, (state, { account }) =>
    produce(state, (draft) => {
      draft.account = account;
      draft.hasAuth = true;
      draft.loadingStatus = LoadingStatus_user.succeeded_auth;
    })
  ),

  on(actions.setAuthError, (state, { authError }) =>
    produce(state, (draft) => {
      draft.authError = authError;
    })
  ),

  on(actions.clearAuthError, (state) =>
    produce(state, (draft) => {
      draft.authError = null;
    })
  )
);
