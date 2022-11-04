import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.reducers";

export const selectUserState = createFeatureSelector<UserState>("user");

export const selectHasAuth = createSelector(selectUserState, (state) => {
  return state.hasAuth;
});

export const selectUserAccount = createSelector(selectUserState, (state) => {
  return state.account;
});

export const selectLoadingStatus_user = createSelector(
  selectUserState,
  (state) => {
    return state.loadingStatus;
  }
);

export const selectAuthError = createSelector(selectUserState, (state) => {
  return state.authError;
});

export const selectPortfolio = createSelector(selectUserState, (state) => {
  return state.portfolio;
});
