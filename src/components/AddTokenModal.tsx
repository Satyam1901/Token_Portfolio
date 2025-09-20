import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addTokensToWatchlist } from '../store/slices/portfolioSlice';
import { coinGeckoService } from '../services/coinGeckoService';
import type { Token, TrendingToken } from '../types';
import { formatCurrency, formatPercentage, getPercentageColor, debounce } from '../utils/helpers';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTokenModal: React.FC<AddTokenModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { watchlist } = useAppSelector((state) => state.portfolio);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const existingTokenIds = new Set(watchlist.map(token => token.id));

  // Search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await coinGeckoService.searchTokens(query);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search tokens');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query);
    }, 300),
    []
  );

  // Load trending tokens
  const loadTrendingTokens = async () => {
    setIsLoadingTrending(true);
    setError(null);

    try {
      const trending = await coinGeckoService.getTrendingTokens();
      setTrendingTokens(trending);
    } catch (err) {
      setError('Failed to load trending tokens');
      setTrendingTokens([]);
    } finally {
      setIsLoadingTrending(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle token selection
  const handleTokenSelect = (tokenId: string) => {
    console.log('Selecting token:', tokenId);
    setSelectedTokens(prev => {
      const newSelection = prev.includes(tokenId)
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId];
      console.log('New selection:', newSelection);
      return newSelection;
    });
  };

  // Handle adding tokens to watchlist
  const handleAddToWatchlist = async () => {
    if (selectedTokens.length === 0) return;

    try {
      // Get tokens from search results (which have current_price)
      const searchTokensToAdd = searchResults.filter(token => selectedTokens.includes(token.id));

      // For trending tokens, we need to fetch their current prices
      const trendingTokenIds = selectedTokens.filter(id =>
        trendingTokens.some(token => token.id === id) &&
        !searchResults.some(token => token.id === id)
      );

      let trendingTokensToAdd: Token[] = [];
      if (trendingTokenIds.length > 0) {
        trendingTokensToAdd = await coinGeckoService.getTokenPrices(trendingTokenIds);
      }

      const allTokensToAdd = [...searchTokensToAdd, ...trendingTokensToAdd];
      dispatch(addTokensToWatchlist(allTokensToAdd));
      setSelectedTokens([]);
      onClose();
    } catch (err) {
      setError('Failed to add tokens to watchlist');
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedTokens([]);
      setError(null);
    }
  }, [isOpen]);

  // Load trending tokens when modal opens
  useEffect(() => {
    if (isOpen && trendingTokens.length === 0) {
      loadTrendingTokens();
    }
  }, [isOpen, trendingTokens.length]);

  if (!isOpen) return null;

  const renderTokenRow = (token: Token | TrendingToken, isTrending: boolean = false) => {
    const isSelected = selectedTokens.includes(token.id);
    const isExisting = existingTokenIds.has(token.id);
    const priceChange = 'price_change_percentage_24h' in token ? token.price_change_percentage_24h : 0;

    return (
      <div
        key={token.id}
        className={`flex items-center justify-between p-3 sm:p-4 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors ${
          isSelected ? 'bg-gray-700' : ''
        } ${isExisting ? 'opacity-50' : ''}`}
        onClick={() => !isExisting && handleTokenSelect(token.id)}
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative">
            <img
              src={token.image}
              alt={token.name}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-token.png';
              }}
            />
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            {isExisting && (
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">+</span>
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-white text-sm sm:text-base">{token.name}</div>
            <div className="text-xs sm:text-sm text-gray-400 uppercase">{token.symbol}</div>
            {!isTrending && 'current_price' in token && (
              <div className="text-xs sm:text-sm text-gray-500">{formatCurrency(token.current_price)}</div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {priceChange !== 0 && (
            <div className={`flex items-center space-x-1 ${
              getPercentageColor(priceChange)
            }`}>
              {priceChange >= 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="text-xs sm:text-sm font-medium">
                {formatPercentage(priceChange)}
              </span>
            </div>
          )}

          {!isExisting && (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <input
                type="radio"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  handleTokenSelect(token.id);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-3 h-3 sm:w-4 sm:h-4 text-green-600"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

        return (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[98vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-end p-3 sm:p-4 lg:p-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 p-1"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>


        {/* Content */}
        <div className="overflow-y-auto max-h-72 sm:max-h-80 lg:max-h-96">
          {/* Search Section */}
          <div className="mb-6 border-b border-gray-600">
            {/* Search Input */}
            <div className="relative mb-4 px-3 sm:px-4 lg:px-6">
              <input
                type="text"
                placeholder="Search tokens (e.g., ETH, SOL)..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Search Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2 px-3 sm:px-4 lg:px-6">
                {searchResults.map(token => renderTokenRow(token))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-4 text-gray-400 text-sm">
                No tokens found for "{searchQuery}"
              </div>
            ) : null}
          </div>

          {/* Trending Tokens Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 px-3 sm:px-4 lg:px-6">Trending</h3>
            {isLoadingTrending ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-400 text-sm">{error}</div>
            ) : trendingTokens.length > 0 ? (
              <div className="space-y-2 px-3 sm:px-4 lg:px-6">
                {trendingTokens.map(token => renderTokenRow(token, true))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 text-sm">
                No trending tokens available
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-3 sm:p-4 lg:p-6">
          <button
            onClick={handleAddToWatchlist}
            disabled={selectedTokens.length === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTokens.length === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-black hover:bg-green-400'
            }`}
          >
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
};
