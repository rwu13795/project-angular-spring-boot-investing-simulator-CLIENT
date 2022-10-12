import { ActionReducerMap } from "@ngrx/store";
import { stockReducer, StockState } from "../stock/stock-state/stock.reducers";

export interface AppState {
  stock: StockState;
}

export const appReducer: ActionReducerMap<AppState> = {
  stock: stockReducer,
};
