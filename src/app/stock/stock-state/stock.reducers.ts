import { createReducer, on } from "@ngrx/store";
import produce from "immer";

import * as actions from "./stock.actions";

export interface StockState {
  currentSymbol: string;
}

const initialState: StockState = {
  currentSymbol: "",
};

export const stockReducer = createReducer(
  initialState,

  on(actions.setCurrentSymbol, (state, { symbol }) =>
    produce(state, (draft) => {
      draft.currentSymbol = symbol;
    })
  )
);
