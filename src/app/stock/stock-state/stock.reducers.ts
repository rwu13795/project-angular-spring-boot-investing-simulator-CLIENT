import { createReducer, on } from "@ngrx/store";
import produce from "immer";
import {
  Response_companyProfile,
  Response_priceChangePercentage,
} from "../stock-models";

import * as actions from "./stock.actions";

export interface StockState {
  currentSymbol: string;
  currentPrice: number;
  currentChangeInPrice: number;
  currentChangePercentage: number;
  currentTimeRange: string;
  companyProfile: Response_companyProfile | null;
  allChangePercentage: Response_priceChangePercentage | null;
}

const initialState: StockState = {
  currentSymbol: "",
  currentPrice: 0,
  currentChangeInPrice: 0,
  currentChangePercentage: 0,
  currentTimeRange: "1D",
  companyProfile: null,
  allChangePercentage: null,
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
      draft.currentChangeInPrice = profile.changes;
    })
  ),

  on(actions.setPriceChangePercentage, (state, { changePercentage }) =>
    produce(state, (draft) => {
      draft.allChangePercentage = changePercentage;
      draft.currentChangePercentage = changePercentage["1D"];
    })
  ),

  on(actions.setCurrentPrice, (state, { currentPrice }) =>
    produce(state, (draft) => {
      draft.currentPrice = currentPrice;
    })
  ),

  on(actions.clearStockState, (state) =>
    produce(state, (draft) => {
      console.log({ ...initialState });
      draft.currentSymbol = "";
      draft.currentPrice = 0;
      draft.currentChangeInPrice = 0;
      draft.currentChangePercentage = 0;
      draft.currentTimeRange = "1D";
      draft.companyProfile = null;
      draft.allChangePercentage = null;
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
      }
    })
  )
);
