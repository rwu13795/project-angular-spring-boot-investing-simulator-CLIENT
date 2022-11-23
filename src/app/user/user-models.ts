export interface InputField {
  [field: string]: string;
}

export interface InputFieldTouched {
  [field: string]: boolean;
}

export interface AuthErrorInField {
  [field: string]: AuthError | null;
}

export interface UserInfo {
  id: number;
  email: string;
  fund: number;
  joinedAt: string;
}

export interface ResetPasswordBody {
  email: string;
  password: string;
  confirm_password: string;
}

export interface Response_checkAuth {
  hasAuth: boolean;
}

export interface AuthError {
  status: number;
  message: string;
  timeStamp: number;
  field: string;
}

export interface Response_authError {
  error: AuthError;
}

export enum InputFieldNames {
  email = "email",
  password = "password",
  confirm_password = "confirm_password",
  new_password = "new_password",
}

export enum LoadingStatus_user {
  idle = "idle",
  succeeded_auth = "succeeded_auth",
  loading_auth = "loading_auth",
  failed_auth = "failed_auth",
  succeeded_portfolio = "succeeded_portfolio",
  loading_portfolio = "loading_portfolio",
  failed_portfolio = "failed_portfolio",
}

export interface Response_PortfolioAccount {
  id: number;
  email: string;
  fund: number;
  joinedAt: number;
  shortSellingDeposit: number;
  totalRealizedGainLoss: number;
  totalRealizedGainLoss_shortSelling: number;
  totalUnrealizedGainLoss: number;
  totalUnrealizedGainLoss_shortSelling: number;
}
export interface Response_PortfolioAsset {
  userId: number;
  symbol: string;
  exchange: string;
  avgCost: number;
  shares: number;
  avgBorrowed: number;
  sharesBorrowed: number;
  realizedGainLoss: number;
  realizedGainLossShortSelling: number;
  unrealizedGainLoss: number;
  unrealizedGainLossBorrowed: number;
  currentPrice: number;
}
export interface PortfolioAssetList {
  [symbol: string]: Response_PortfolioAsset;
}
export interface PortfolioWatchlist {
  [symbol: string]: string;
}
export interface Response_Portfolio {
  account: Response_PortfolioAccount;
  symbols: string[];
  assets: PortfolioAssetList;
  watchlist: PortfolioWatchlist;
}

export interface Response_transaction {
  id: number;
  userId: number;
  symbol: string;
  pricePerShare: number;
  shares: number;
  realizedGainLoss: number;
  assetTotalRealizedGainLoss: number;
  timestamp: number;
  buy?: boolean;
  shortSell?: boolean;
}

export interface Response_transactionCount {
  count: number;
}
