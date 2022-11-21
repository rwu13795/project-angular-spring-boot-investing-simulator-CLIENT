import { createFeatureSelector, createSelector } from "@ngrx/store";
import { StockState } from "./stock.reducers";

export const selectStockState = createFeatureSelector<StockState>("stock");

export const selectCurrentSymbol = createSelector(selectStockState, (state) => {
  return state.currentSymbol;
});

export const selectCurrentPrice = createSelector(selectStockState, (state) => {
  return state.currentPrice;
});

export const selectPreviousPrice = createSelector(selectStockState, (state) => {
  return state.previousPrice;
});

export const selectChangeInPrice = createSelector(selectStockState, (state) => {
  return state.currentChangeInPrice;
});

export const selectPreviousChangeInPrice = createSelector(
  selectStockState,
  (state) => {
    return state.previousChangeInPrice;
  }
);

export const selectChangePercentage = createSelector(
  selectStockState,
  (state) => {
    return state.currentChangePercentage;
  }
);

export const selectPreviousChangePercentage = createSelector(
  selectStockState,
  (state) => {
    return state.previousChangePercentage;
  }
);

export const selectCurrentPriceData = createSelector(
  selectStockState,
  (state) => {
    return {
      price: state.currentPrice,
      change: state.currentChangeInPrice,
      changePercentage: state.currentChangePercentage,
    };
  }
);

export const selectCompanyProfile = createSelector(
  selectStockState,
  (state) => {
    return state.companyProfile;
  }
);

export const selectTimeRange = createSelector(selectStockState, (state) => {
  return state.currentTimeRange;
});

export const selectStockListOption = createSelector(
  selectStockState,
  (state) => {
    return state.stockListOption;
  }
);

export const selectStockActiveMenu = createSelector(
  selectStockState,
  (state) => {
    return state.stockActiveMenu;
  }
);

export const selectOpenTradeModal = createSelector(
  selectStockState,
  (state) => {
    return state.openTradeModal;
  }
);
