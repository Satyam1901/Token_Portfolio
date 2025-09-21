import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WatchlistToken, Token } from '../../types';
import { generateChartColors } from '../../utils/helpers';
import { coinGeckoService } from '../../services/coinGeckoService';
import { sampleTokens } from '../../data/sampleData';

interface PortfolioState {
  watchlist: WatchlistToken[];
  totalValue: number;
  dailyChange: number;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;

  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  hasMore: boolean;
  paginatedWatchlist: WatchlistToken[];
}

const initialState: PortfolioState = {
  watchlist: [],
  totalValue: 0,
  dailyChange: 0,
  lastUpdated: null,
  isLoading: false,
  error: null,

  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  hasMore: false,
  paginatedWatchlist: [],
};


const loadPortfolioFromStorage = (): WatchlistToken[] => {
  try {
    const saved = localStorage.getItem('token-portfolio-watchlist');
    if (saved) {
      const parsedData = JSON.parse(saved);

      if (parsedData.length < 15) {
        console.log('Old data detected, using new sample data with', sampleTokens.length, 'tokens');
        return sampleTokens;
      }
      return parsedData;
    }

    console.log('No saved data, using sample data with', sampleTokens.length, 'tokens');
    return sampleTokens;
  } catch (error) {
    console.error('Error loading portfolio from storage:', error);
    return sampleTokens;
  }
};


const savePortfolioToStorage = (watchlist: WatchlistToken[]) => {
  try {
    localStorage.setItem('token-portfolio-watchlist', JSON.stringify(watchlist));
  } catch (error) {
    console.error('Error saving portfolio to storage:', error);
  }
};


const calculatePortfolioMetrics = (watchlist: WatchlistToken[]) => {
  const totalValue = watchlist.reduce((sum, token) => sum + token.value, 0);
  const previousTotalValue = watchlist.reduce((sum, token) => {
    const previousValue = token.value / (1 + token.price_change_percentage_24h / 100);
    return sum + previousValue;
  }, 0);
  const dailyChange = totalValue - previousTotalValue;

  return { totalValue, dailyChange };
};


export const refreshTokenPrices = createAsyncThunk(
  'portfolio/refreshTokenPrices',
  async (_, { getState }) => {
    const state = getState() as { portfolio: PortfolioState };
    const { watchlist } = state.portfolio;

    if (watchlist.length === 0) {
      return { watchlist: [], lastUpdated: new Date().toISOString() };
    }

    const tokenIds = watchlist.map(token => token.id);
    const updatedTokens = await coinGeckoService.getTokenPrices(tokenIds);

    const updatedWatchlist = watchlist.map(token => {
      const updatedToken = updatedTokens.find(t => t.id === token.id);
      if (updatedToken) {
        return {
          ...token,
          current_price: updatedToken.current_price,
          price_change_percentage_24h: updatedToken.price_change_percentage_24h,
          sparkline_in_7d: updatedToken.sparkline_in_7d,
          value: token.holdings * updatedToken.current_price,
        };
      }
      return token;
    });

    return { watchlist: updatedWatchlist, lastUpdated: new Date().toISOString() };
  }
);


export const loadPaginatedWatchlist = createAsyncThunk(
  'portfolio/loadPaginatedWatchlist',
  async ({ page, itemsPerPage }: { page: number; itemsPerPage: number }, { getState }) => {
    const state = getState() as { portfolio: PortfolioState };
    const { watchlist } = state.portfolio;

    if (watchlist.length === 0) {
      return {
        paginatedWatchlist: [],
        totalItems: 0,
        hasMore: false,
        currentPage: page,
        lastUpdated: new Date().toISOString()
      };
    }

    const tokenIds = watchlist.map(token => token.id);
    const result = await coinGeckoService.getTokenPricesPaginated(tokenIds, page, itemsPerPage);


    const paginatedWatchlist = result.tokens.map(token => {
      const watchlistToken = watchlist.find(wt => wt.id === token.id);
      return {
        ...token,
        holdings: watchlistToken?.holdings || 0,
        value: (watchlistToken?.holdings || 0) * token.current_price,
        color: watchlistToken?.color || '#9CA3AF',
      };
    });

    return {
      paginatedWatchlist,
      totalItems: result.totalCount,
      hasMore: result.hasMore,
      currentPage: page,
      lastUpdated: new Date().toISOString(),
    };
  }
);

export const addTokensToWatchlist = createAsyncThunk(
  'portfolio/addTokensToWatchlist',
  async (tokens: Token[]) => {
    const colors = generateChartColors(tokens.length);

    const newWatchlistTokens: WatchlistToken[] = tokens.map((token, index) => ({
      ...token,
      holdings: 0,
      value: 0,
      color: colors[index],
    }));

    return newWatchlistTokens;
  }
);

const initialWatchlist = loadPortfolioFromStorage();
const { totalValue, dailyChange } = calculatePortfolioMetrics(initialWatchlist);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    ...initialState,
    watchlist: initialWatchlist,
    totalValue,
    dailyChange,
    lastUpdated: new Date().toISOString(),
    totalItems: initialWatchlist.length,
    paginatedWatchlist: initialWatchlist.slice(0, 10),
  },
  reducers: {
    updateTokenHoldings: (state, action: PayloadAction<{ tokenId: string; holdings: number }>) => {
      const { tokenId, holdings } = action.payload;
      const tokenIndex = state.watchlist.findIndex(token => token.id === tokenId);

      if (tokenIndex !== -1) {
        state.watchlist[tokenIndex].holdings = holdings;
        state.watchlist[tokenIndex].value = holdings * state.watchlist[tokenIndex].current_price;


        const paginatedIndex = state.paginatedWatchlist.findIndex(token => token.id === tokenId);
        if (paginatedIndex !== -1) {
          state.paginatedWatchlist[paginatedIndex].holdings = holdings;
          state.paginatedWatchlist[paginatedIndex].value = holdings * state.paginatedWatchlist[paginatedIndex].current_price;
        }

        const { totalValue, dailyChange } = calculatePortfolioMetrics(state.watchlist);
        state.totalValue = totalValue;
        state.dailyChange = dailyChange;

        savePortfolioToStorage(state.watchlist);
      }
    },
    removeTokenFromWatchlist: (state, action: PayloadAction<string>) => {
      const tokenId = action.payload;
      state.watchlist = state.watchlist.filter(token => token.id !== tokenId);
      state.paginatedWatchlist = state.paginatedWatchlist.filter(token => token.id !== tokenId);
      state.totalItems = Math.max(0, state.totalItems - 1);

      const { totalValue, dailyChange } = calculatePortfolioMetrics(state.watchlist);
      state.totalValue = totalValue;
      state.dailyChange = dailyChange;

      savePortfolioToStorage(state.watchlist);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshTokenPrices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshTokenPrices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.watchlist = action.payload.watchlist;
        state.lastUpdated = action.payload.lastUpdated;

        const { totalValue, dailyChange } = calculatePortfolioMetrics(state.watchlist);
        state.totalValue = totalValue;
        state.dailyChange = dailyChange;

        savePortfolioToStorage(state.watchlist);
      })
      .addCase(refreshTokenPrices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to refresh token prices';
      })
      .addCase(addTokensToWatchlist.fulfilled, (state, action) => {
        const newTokens = action.payload;
        const existingIds = new Set(state.watchlist.map(token => token.id));
        const uniqueNewTokens = newTokens.filter(token => !existingIds.has(token.id));

        state.watchlist = [...state.watchlist, ...uniqueNewTokens];
        state.totalItems = state.watchlist.length;

        const { totalValue, dailyChange } = calculatePortfolioMetrics(state.watchlist);
        state.totalValue = totalValue;
        state.dailyChange = dailyChange;

        savePortfolioToStorage(state.watchlist);
      })
      .addCase(loadPaginatedWatchlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadPaginatedWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paginatedWatchlist = action.payload.paginatedWatchlist;
        state.totalItems = action.payload.totalItems;
        state.hasMore = action.payload.hasMore;
        state.currentPage = action.payload.currentPage;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(loadPaginatedWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load paginated watchlist';
      });
  },
});

export const { updateTokenHoldings, removeTokenFromWatchlist, setCurrentPage, setItemsPerPage, clearError } = portfolioSlice.actions;
export default portfolioSlice.reducer;
