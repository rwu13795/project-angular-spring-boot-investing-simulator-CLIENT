import { createFeatureSelector, createSelector } from "@ngrx/store";
import { StockState } from "./stock.reducers";

export const selectStockState = createFeatureSelector<StockState>("stock");

export const selectCurrentSymbol = createSelector(selectStockState, (state) => {
  return state.currentSymbol;
});
