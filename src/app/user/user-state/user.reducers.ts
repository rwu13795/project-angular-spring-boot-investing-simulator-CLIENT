import { createReducer, on } from "@ngrx/store";
import produce from "immer";
import { AuthError, LoadingStatus_user, UserAccount } from "../user-models";

import * as actions from "./user.actions";

export interface UserState {
  loadingStatus: LoadingStatus_user;
  hasAuth: boolean;
  account: UserAccount;
  authError: AuthError | null;
  portfolio: string;
  isSignInModalOpen: boolean;
}

const initialState: UserState = {
  loadingStatus: LoadingStatus_user.loading_auth,
  hasAuth: false,
  account: { id: -1, email: "", fund: 0, joinedAt: "" },
  authError: null,
  portfolio: "",
  isSignInModalOpen: false,
};

export const userReducer = createReducer(
  { ...initialState },

  on(actions.setAuth, (state, { hasAuth }) =>
    produce(state, (draft) => {
      if (!hasAuth) draft.loadingStatus = LoadingStatus_user.failed_auth;
      draft.hasAuth = hasAuth;
      draft.loadingStatus = LoadingStatus_user.idle;
    })
  ),

  on(actions.setUserAccount, (state, { account }) =>
    produce(state, (draft) => {
      draft.account = account;
      draft.hasAuth = true;
      draft.loadingStatus = LoadingStatus_user.idle;
    })
  ),

  on(actions.setAuthError, (state, { authError }) =>
    produce(state, (draft) => {
      if (authError) {
        // to prolong the loading button animation, to prevent some ugly flashing
        draft.loadingStatus = LoadingStatus_user.failed_auth;
      }
      draft.authError = authError;
    })
  ),

  on(actions.clearAuthError, (state) =>
    produce(state, (draft) => {
      draft.authError = null;
    })
  ),

  on(actions.setPortfolio, (state, { portfolio }) =>
    produce(state, (draft) => {
      draft.portfolio = portfolio;
    })
  ),

  on(actions.setLoadingStatus_user, (state, { status }) =>
    produce(state, (draft) => {
      draft.loadingStatus = status;
    })
  ),

  on(actions.removeUserAuth, (state) =>
    produce(state, (draft) => {
      draft.account = { id: -1, email: "", fund: 0, joinedAt: "" };
      draft.hasAuth = false;
      draft.loadingStatus = LoadingStatus_user.idle;
    })
  ),

  on(actions.toggleSignInModal, (state, { open }) =>
    produce(state, (draft) => {
      draft.isSignInModalOpen = open;
    })
  )
);
