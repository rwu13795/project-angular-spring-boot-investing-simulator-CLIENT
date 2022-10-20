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
  y: number[]; // [open, high, low, close, real-time-timestamp]
}
export interface VolumeData {
  x: Date; // timestamp
  y: number;
}
export interface CandleLineData {
  x: Date; // timestamp
  y: number;
  meta: number[];
}

export interface ChartData {
  volumes: VolumeData[];
  candles: CandleData[];
  candleLine: CandleLineData[];
  highBound: number;
  lowBound: number;
  currentTotalVolume: number;
}

export interface Response_realTimePrice {
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

export interface Response_quoteShort {
  symbol: string;
  price: number;
  volume: number;
}

export interface Response_companyProfile {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export interface Response_priceChangePercentage {
  // symbol: string;
  "1D": number;
  "5D": number;
  "1M": number;
  "3M": number;
  "6M": number;
  ytd: number;
  "1Y": number;
  "3Y": number;
  "5Y": number;
  "10Y": number;
  max: number;
  [timeRange: string]: number;
}

export interface Response_financialRatio {
  peRatioTTM: number;
  operatingProfitMarginTTM: number;
  returnOnAssetsTTM: number;
  returnOnEquityTTM: number;
  debtEquityRatioTTM: number;
  priceToBookRatioTTM: number;
}
