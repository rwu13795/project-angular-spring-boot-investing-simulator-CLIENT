export interface MajorIndex {
  [ticker: string]: {
    name: string;
    symbol: string;
  };
}

export interface Response_realTimeIndex {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  exchange: string;
  open: number;
  previousClose: number;
  timestamp: number;
}

export interface RealTimeIndex extends Response_realTimeIndex {
  _symbol: string;
}
