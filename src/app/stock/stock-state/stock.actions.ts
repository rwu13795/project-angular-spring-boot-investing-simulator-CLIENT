import { createAction, props } from "@ngrx/store";
import {
  Response_companyProfile,
  Response_priceChangePercentage,
} from "../stock-models";

export const setCurrentSymbol = createAction(
  "[Stock] Set Current Symbol",
  props<{ symbol: string }>()
);

export const fetchCompanyProfile = createAction(
  "[Stock] Fetch Company Profile",
  props<{ symbol: string }>()
);

export const setCompanyProfile = createAction(
  "[Stock] Set Company Profile",
  props<{ profile: Response_companyProfile }>()
);

export const fetchPriceChangePercentage = createAction(
  "[Stock] Fetch Price Change Percentage",
  props<{ symbol: string }>()
);

export const setPriceChangePercentage = createAction(
  "[Stock] Set Price Change Percentage",
  props<{ changePercentage: Response_priceChangePercentage }>()
);

export const setCurrentPrice = createAction(
  "[Stock] Set Current Price",
  props<{ currentPrice: number }>()
);

export const clearStockState = createAction("[Stock] Clear Stock State");

export const setCurrentTimeRange = createAction(
  "[Stock] Set Current Time Range",
  props<{ timeRange: string }>()
);
