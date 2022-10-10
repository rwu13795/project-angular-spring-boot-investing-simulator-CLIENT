export interface Response_searchByName {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

export interface Response_historyPrice {
  date: string;
  open: number;
  low: number;
  high: number;
  close: number;
  volume: number;
}

export interface Response_historyPriceFull {
  // for the daily price api "/historical-price-full"
  historical: Response_historyPrice[];
}

export interface CandleData {
  x: Date; // timestamp
  y: number[]; // [open, high, low, close]
}
export interface VolumnData {
  x: Date; // timestamp
  y: number;
}

export interface ChartData {
  volumns: VolumnData[];
  candles: CandleData[];
  candleLine: VolumnData[];
  highBound: number;
  lowBound: number;
  currentTotalVolume: number;
}

export interface RealTimePrice {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  exchange: string;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

export interface StoredChartData {
  [timeRange: string]: ChartData | null;
}
