import { createFeatureSelector, createSelector } from "@ngrx/store";
import { StockState } from "./stock.reducers";

export const selectStockState = createFeatureSelector<StockState>("stock");

export const selectCurrentSymbol = createSelector(selectStockState, (state) => {
  return state.currentSymbol;
});

export const selectCurrentPrice = createSelector(selectStockState, (state) => {
  return state.currentPrice;
});

export const selectChangeInPrice = createSelector(selectStockState, (state) => {
  return state.currentChangeInPrice;
});

export const selectCompanyProfile = createSelector(
  selectStockState,
  (state) => {
    return state.companyProfile;
  }
);

export const selectChangePercentage = createSelector(
  selectStockState,
  (state) => {
    return state.currentChangePercentage;
  }
);
