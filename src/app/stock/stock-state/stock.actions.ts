import { createAction, props } from "@ngrx/store";
import { ListTypes } from "src/app/preview-list/preview-list-models";

import {
  Response_companyProfile,
  Response_allChangePercentage,
  StockMenu,
} from "../stock-models";

export const setCurrentSymbol = createAction(
  "[Stock] Set Current Symbol",
  props<{ symbol: string; updated?: boolean }>()
);

export const fetchCompanyProfile = createAction(
  "[Stock] Fetch Company Profile",
  props<{ symbol: string }>()
);

export const setCompanyProfile = createAction(
  "[Stock] Set Company Profile",
  props<{ profile: Response_companyProfile }>()
);

export const fetchAllChangePercentage = createAction(
  "[Stock] Fetch All Change Percentage",
  props<{ symbol: string }>()
);

export const setAllChangePercentage = createAction(
  "[Stock] Set All Change Percentage",
  props<{ changePercentage: Response_allChangePercentage }>()
);

export const setCurrentPrice = createAction(
  "[Stock] Set Current Price",
  props<{ currentPrice: number }>()
);

export const setCurrentChangeInPrice = createAction(
  "[Stock] Set Current Change In Price",
  props<{ changeInPrice: number }>()
);

export const setCurrentChangePercentage = createAction(
  "[Stock] Set Current Change Percentage",
  props<{ changePercentage: number }>()
);

export const setCurrentTimeRange = createAction(
  "[Stock] Set Current Time Range",
  props<{ timeRange: string }>()
);

export const setStockListOption = createAction(
  "[Stock] Set Stock List Option",
  props<{ listType: ListTypes }>()
);

export const setStockActiveMenu = createAction(
  "[Stock] Set Stock Active Menu",
  props<{ menu: StockMenu }>()
);

export const toggleTradeModal = createAction(
  "[Stock] Toggle Trade Modal",
  props<{ open: boolean }>()
);

export const clearTargetStock = createAction("[Stock] clear Target Stock");
