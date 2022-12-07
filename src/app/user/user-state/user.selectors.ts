import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.reducers";

export const selectUserState = createFeatureSelector<UserState>("user");

export const selectHasAuth = createSelector(selectUserState, (state) => {
  return state.hasAuth;
});

export const selectUserInfo = createSelector(selectUserState, (state) => {
  return state.userInfo;
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

export const selectSignInModalOpen = createSelector(
  selectUserState,
  (state) => {
    return state.isSignInModalOpen;
  }
);

export const selectWatchlist = createSelector(selectPortfolio, (portfolio) => {
  if (!portfolio) return null;
  return portfolio.watchlist;
});

export const selectAssets = createSelector(selectPortfolio, (portfolio) => {
  if (!portfolio) return null;
  return portfolio.assets;
});

export const selectAccount = createSelector(selectPortfolio, (portfolio) => {
  if (!portfolio) return null;
  return portfolio.account;
});

export const selectTargetAsset = (symbol: string) => {
  console.log("symbol in select target asset", symbol);

  return createSelector(selectAssets, (assets) => {
    console.log(assets![symbol]);

    if (!assets || !assets[symbol]) return null;
    return assets[symbol];
  });
};
