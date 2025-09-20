import React, { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { config } from './config/wagmi';
import { PortfolioSummary } from './PortfolioSummary';
import { WatchlistTable } from './components/WatchlistTable';
import { AddTokenModal } from './components/AddTokenModal';
import { WalletConnect } from './components/WalletConnect';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { refreshTokenPrices } from './store/slices/portfolioSlice';
import { generateChartColors } from './utils/helpers';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { watchlist, lastUpdated, isLoading, currentPage, itemsPerPage } = useAppSelector((state) => state.portfolio);
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);

  // Generate chart data from current page only
  const { chartData, currentPageTotalValue } = useMemo(() => {
    if (watchlist.length === 0) return { chartData: [], currentPageTotalValue: 0 };

    // Get current page data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = watchlist.slice(startIndex, startIndex + itemsPerPage);

    if (currentPageData.length === 0) return { chartData: [], currentPageTotalValue: 0 };

    // Calculate total value for current page only
    const currentPageTotalValue = currentPageData.reduce((sum, token) => sum + token.value, 0);

    const colors = generateChartColors(currentPageData.length);
    const chartData = currentPageData.map((token, index) => ({
      name: token.name,
      symbol: token.symbol,
      value: token.value,
      color: colors[index],
      percentage: currentPageTotalValue > 0 ? (token.value / currentPageTotalValue) * 100 : 0,
    }));

    return { chartData, currentPageTotalValue };
  }, [watchlist, currentPage, itemsPerPage]);

  // Refresh prices on component mount
  useEffect(() => {
    if (watchlist.length > 0) {
      dispatch(refreshTokenPrices());
    }
  }, [dispatch, watchlist.length]);

  const handleRefreshPrices = () => {
    dispatch(refreshTokenPrices());
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-700">
        <div className="w-full px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Token Portfolio</h1>
            </div>
            <div className="flex items-center">
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 py-4 sm:py-6">
        {/* Portfolio Summary */}
        <PortfolioSummary
          totalValue={currentPageTotalValue}
          chartData={chartData}
          lastUpdated={lastUpdated}
        />

        {/* Watchlist Table */}
        <WatchlistTable
          onRefresh={handleRefreshPrices}
          isLoading={isLoading}
          onAddToken={() => setIsAddTokenModalOpen(true)}
        />
      </main>

      {/* Add Token Modal */}
      <AddTokenModal
        isOpen={isAddTokenModalOpen}
        onClose={() => setIsAddTokenModalOpen(false)}
      />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <AppContent />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  );
}

export default App;
