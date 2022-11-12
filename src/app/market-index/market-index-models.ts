import { Response_realTimePrice } from "../stock/stock-models";

export interface MajorIndex {
  [ticker: string]: {
    name: string;
    symbol: string;
  };
}

export interface RealTimeIndex extends Response_realTimePrice {
  _symbol: string;
  [key: string]: number | string;
}
