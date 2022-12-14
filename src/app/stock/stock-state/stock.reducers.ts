import { createReducer, on } from "@ngrx/store";
import produce from "immer";
import { ListTypes } from "src/app/preview-list/preview-list-models";

import {
  Response_companyProfile,
  Response_allChangePercentage,
  StockMenu,
} from "../stock-models";

import * as actions from "./stock.actions";

export interface StockState {
  currentSymbol: { symbol: string; previousSymbol: string; isUpdated: boolean };
  currentPrice: number;
  previousPrice: number;
  currentChangeInPrice: number;
  previousChangeInPrice: number;
  currentChangePercentage: number;
  previousChangePercentage: number;
  currentTimeRange: string;
  companyProfile: Response_companyProfile | null;
  allChangePercentage: Response_allChangePercentage | null;
  stockListOption: ListTypes;
  stockActiveMenu: StockMenu;
  openTradeModal: boolean;
}

const initialState: StockState = {
  currentSymbol: { symbol: "", previousSymbol: "", isUpdated: false },
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
  stockActiveMenu: StockMenu.summary,
  openTradeModal: false,
};

export const stockReducer = createReducer(
  { ...initialState },

  on(actions.setCurrentSymbol, (state, { symbol, updated }) =>
    produce(state, (draft) => {
      if (draft.currentSymbol.previousSymbol !== symbol) {
        draft.currentSymbol.symbol = symbol;
        draft.currentSymbol.previousSymbol = symbol;
        draft.currentSymbol.isUpdated = true;

        // clear the previous stock info if the symbol has changed
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
      }
      if (updated !== undefined) {
        draft.currentSymbol.isUpdated = updated;
      }
    })
  ),

  on(actions.clearTargetStock, (state) =>
    produce(state, (draft) => {
      draft.currentSymbol = {
        symbol: "",
        previousSymbol: "",
        isUpdated: false,
      };
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
      draft.stockActiveMenu = StockMenu.summary;
      draft.openTradeModal = false;
    })
  ),

  on(actions.setCompanyProfile, (state, { profile }) =>
    produce(state, (draft) => {
      if (profile) {
        draft.companyProfile = profile;
        draft.currentPrice = profile.price;
        draft.previousPrice = profile.price;
        draft.currentChangeInPrice = profile.changes;
        draft.previousChangeInPrice = profile.changes;
      }
    })
  ),

  on(actions.setAllChangePercentage, (state, { changePercentage }) =>
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
  ),

  on(actions.setStockActiveMenu, (state, { menu }) =>
    produce(state, (draft) => {
      draft.stockActiveMenu = menu;
    })
  ),

  on(actions.toggleTradeModal, (state, { open }) =>
    produce(state, (draft) => {
      draft.openTradeModal = open;
    })
  )
);
