export interface Response_stockList {
  symbol: string;
  name: string;
  change: number;
  price: number;
  changesPercentage: number;
}

export interface StockPerformanceLists {
  gainers: Response_stockList[] | null;
  losers: Response_stockList[] | null;
  actives: Response_stockList[] | null;
  [option: string]: Response_stockList[] | null;
}

export enum ListTypes {
  actives = "actives",
  gainers = "gainers",
  losers = "losers",
}

export enum SortBy {
  symbol = "symbol",
  name = "name",
  price = "price",
  changeInPrice = "changeInPrice",
  changePercentage = "changePercentage",
}

export interface Response_peerStocks {
  symbol: string;
  peersList: string[];
}
