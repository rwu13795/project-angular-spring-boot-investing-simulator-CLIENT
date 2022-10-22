import { createReducer, on } from "@ngrx/store";
import produce from "immer";
import { ListTypes } from "../stock-list/stock-list-models";
import {
  Response_companyProfile,
  Response_priceChangePercentage,
} from "../stock-models";

import * as actions from "./stock.actions";

export interface StockState {
  currentSymbol: string;
  currentPrice: number;
  previousPrice: number;
  currentChangeInPrice: number;
  previousChangeInPrice: number;
  currentChangePercentage: number;
  previousChangePercentage: number;
  currentTimeRange: string;
  companyProfile: Response_companyProfile | null;
  allChangePercentage: Response_priceChangePercentage | null;
  stockListOption: ListTypes;
}

const initialState: StockState = {
  currentSymbol: "",
  currentPrice: 0,
  previousPrice: 0,
  currentChangeInPrice: 0,
  previousChangeInPrice: 0,
  currentChangePercentage: 0,
  previousChangePercentage: 0,
  currentTimeRange: "1D",
  companyProfile: null,
  allChangePercentage: null,
  stockListOption: ListTypes.actives,
};

export const stockReducer = createReducer(
  { ...initialState },

  on(actions.setCurrentSymbol, (state, { symbol }) =>
    produce(state, (draft) => {
      draft.currentSymbol = symbol;
    })
  ),

  on(actions.setCompanyProfile, (state, { profile }) =>
    produce(state, (draft) => {
      draft.companyProfile = profile;
      draft.currentPrice = profile.price;
      draft.previousPrice = profile.price;
      draft.currentChangeInPrice = profile.changes;
      draft.previousChangeInPrice = profile.changes;
    })
  ),

  on(actions.setPriceChangePercentage, (state, { changePercentage }) =>
    produce(state, (draft) => {
      draft.allChangePercentage = changePercentage;
      draft.currentChangePercentage = changePercentage["1D"];
      draft.previousChangePercentage = changePercentage["1D"];
    })
  ),

  on(actions.setCurrentPrice, (state, { currentPrice }) =>
    produce(state, (draft) => {
      draft.previousPrice = state.currentPrice;
      draft.currentPrice = currentPrice;
    })
  ),

  on(actions.setCurrentChangeInPrice, (state, { changeInPrice }) =>
    produce(state, (draft) => {
      draft.previousChangeInPrice = state.currentChangeInPrice;
      draft.currentChangeInPrice = changeInPrice;
    })
  ),

  on(actions.setCurrentChangePercentage, (state, { changePercentage }) =>
    produce(state, (draft) => {
      draft.previousChangePercentage = state.currentChangePercentage;
      draft.currentChangePercentage = changePercentage;
    })
  ),

  on(actions.setStockListOption, (state, { listType }) =>
    produce(state, (draft) => {
      draft.stockListOption = listType;
    })
  ),

  on(actions.clearStockState, (state) =>
    produce(state, (draft) => {
      console.log({ ...initialState });
      draft.currentSymbol = "";
      draft.currentPrice = 0;
      draft.previousPrice = 0;
      draft.currentChangeInPrice = 0;
      draft.previousChangeInPrice = 0;
      draft.currentChangePercentage = 0;
      draft.previousChangePercentage = 0;
      draft.currentTimeRange = "1D";
      draft.companyProfile = null;
      draft.allChangePercentage = null;
      draft.stockListOption = ListTypes.actives;
    })
  ),

  on(actions.setCurrentTimeRange, (state, { timeRange }) =>
    produce(state, (draft) => {
      draft.currentTimeRange = timeRange;

      if (state.allChangePercentage && state.allChangePercentage[timeRange]) {
        // calculate the price change for the specific time range

        draft.currentChangeInPrice =
          state.currentPrice -
          state.currentPrice /
            (1 + state.allChangePercentage[timeRange] * 0.01);
        draft.currentChangePercentage = state.allChangePercentage[timeRange];

        // since the changes for each specific time range is not related to
        // each other closely, setting the  changes of "5D" as the previous value
        // of "1M" is meaningless. I should set the values to 0, so that the
        // transition starts from "0"
        draft.previousChangeInPrice = 0;
        draft.previousChangePercentage = 0;
      }
    })
  )
);
