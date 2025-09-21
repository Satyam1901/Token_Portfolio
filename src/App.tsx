import React, { useEffect, useMemo, useState } from "react";
import { Provider } from "react-redux";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import { config } from "./config/wagmi";
import { PortfolioSummary } from "./PortfolioSummary";
import { WatchlistTable } from "./components/WatchlistTable";
import { AddTokenModal } from "./components/AddTokenModal";
import { WalletConnect } from "./components/WalletConnect";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { refreshTokenPrices } from "./store/slices/portfolioSlice";
import { generateChartColors } from "./utils/helpers";
import "@rainbow-me/rainbowkit/styles.css";
import "./App.css";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { watchlist, lastUpdated, isLoading, currentPage, itemsPerPage } =
    useAppSelector((state) => state.portfolio);
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);

  const { chartData, currentPageTotalValue } = useMemo(() => {
    if (watchlist.length === 0)
      return { chartData: [], currentPageTotalValue: 0 };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = watchlist.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    if (currentPageData.length === 0)
      return { chartData: [], currentPageTotalValue: 0 };

    const currentPageTotalValue = currentPageData.reduce(
      (sum, token) => sum + token.value,
      0
    );

    const colors = generateChartColors(currentPageData.length);
    const chartData = currentPageData.map((token, index) => ({
      name: token.name,
      symbol: token.symbol,
      value: token.value,
      color: colors[index],
      percentage:
        currentPageTotalValue > 0
          ? (token.value / currentPageTotalValue) * 100
          : 0,
    }));

    return { chartData, currentPageTotalValue };
  }, [watchlist, currentPage, itemsPerPage]);

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
            <div className="flex items-center space-x-3">
              {/* App Icon - Green square with white shape */}
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#A9E851" }}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                Token Portfolio
              </h1>
            </div>
            <div className="flex items-center">
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 py-6 sm:py-8">
        <PortfolioSummary
          totalValue={currentPageTotalValue}
          chartData={chartData}
          lastUpdated={lastUpdated}
        />

        <div className="border-t border-gray-600 mb-6 sm:mb-8"></div>

        <WatchlistTable
          onRefresh={handleRefreshPrices}
          isLoading={isLoading}
          onAddToken={() => setIsAddTokenModalOpen(true)}
        />
      </main>

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
