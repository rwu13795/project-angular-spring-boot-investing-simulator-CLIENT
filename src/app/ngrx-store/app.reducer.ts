import { ActionReducerMap } from "@ngrx/store";
import { stockReducer, StockState } from "../stock/stock-state/stock.reducers";
import { userReducer, UserState } from "../user/user-state/user.reducers";

export interface AppState {
  stock: StockState;
  user: UserState;
}

export const appReducer: ActionReducerMap<AppState> = {
  stock: stockReducer,
  user: userReducer,
};
