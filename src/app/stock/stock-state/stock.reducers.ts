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
  currentChanges: number;
  companyProfile: Response_companyProfile | null;
  changePercentage: Response_priceChangePercentage | null;
}

const initialState: StockState = {
  currentSymbol: "",
  currentPrice: 0,
  currentChanges: 0,
  companyProfile: null,
  changePercentage: null,
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
      draft.currentChanges = profile.changes;
    })
  ),

  on(actions.setPriceChangePercentage, (state, { changePercentage }) =>
    produce(state, (draft) => {
      draft.changePercentage = changePercentage;
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
      draft.currentChanges = 0;
      draft.companyProfile = null;
      draft.changePercentage = null;
    })
  )
);
