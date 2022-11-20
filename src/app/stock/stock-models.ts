import { Response_transaction } from "../user/user-models";

export interface Response_historyPrice {
  date: string;
  open: number;
  low: number;
  high: number;
  close: number;
  volume: number;
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

export interface Response_allChangePercentage {
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

export type CustomTimeRange =
  | "1min"
  | "5min"
  | "15min"
  | "30min"
  | "1hour"
  | "4hour";

export enum StockMenu {
  summary = "summary",
  statement = "statement",
  chart = "chart",
  profile = "profile",
  asset = "asset",
}

// ---------------- charts ---------------- //
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
export interface ColumnChart {
  x: string;
  y: number;
}
export interface TransactionsData {
  transactions: Response_transaction[];
  overallChart: VolumeData[];
  buyChart: ColumnChart[];
  sellChart: ColumnChart[];
}

export interface ChartData {
  volumes: VolumeData[];
  candles: CandleData[];
  candleLine: CandleLineData[];
  highBound: number;
  lowBound: number;
  currentTotalVolume: number;
}
