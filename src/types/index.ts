export interface Token {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
  market_cap_rank?: number;
}

export interface WatchlistToken extends Token {
  holdings: number;
  value: number;
  color: string;
}

export interface ChartData {
  name: string;
  symbol?: string;
  value: number;
  color: string;
  percentage: number;
  [key: string]: any;
}

export interface PortfolioState {
  watchlist: WatchlistToken[];
  totalValue: number;
  dailyChange: number;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  portfolio: PortfolioState;
  wallet: WalletState;
}

export interface CoinGeckoResponse {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
  market_cap_rank?: number;
}

export interface TrendingToken {
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

export interface AddTokenModalState {
  isOpen: boolean;
  searchQuery: string;
  searchResults: Token[];
  trendingTokens: TrendingToken[];
  selectedTokens: string[];
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
