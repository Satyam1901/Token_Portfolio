import React, { useState, useMemo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  updateTokenHoldings,
  removeTokenFromWatchlist,
  setCurrentPage,
} from "../store/slices/portfolioSlice";
import {
  formatCurrency,
  formatPercentage,
  getPercentageColor,
} from "../utils/helpers";
import {
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Edit2,
  Trash2,
  RefreshCw,
  Plus,
  Star,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface WatchlistTableProps {
  onRefresh: () => void;
  isLoading: boolean;
  onAddToken: () => void;
}

export const WatchlistTable: React.FC<WatchlistTableProps> = ({
  onRefresh,
  isLoading,
  onAddToken,
}) => {
  const dispatch = useAppDispatch();
  const { watchlist, currentPage, itemsPerPage } = useAppSelector(
    (state) => state.portfolio
  );
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(null);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const totalPages = Math.ceil(watchlist.length / itemsPerPage);

  const paginatedWatchlist = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return watchlist.slice(startIndex, startIndex + itemsPerPage);
  }, [watchlist, currentPage, itemsPerPage]);

  const handleEditHoldings = (tokenId: string, currentHoldings: number) => {
    setEditingToken(tokenId);
    setEditingValue(currentHoldings.toString());
  };

  const handleSaveHoldings = (tokenId: string) => {
    const holdings = parseFloat(editingValue);
    if (!isNaN(holdings) && holdings >= 0) {
      dispatch(updateTokenHoldings({ tokenId, holdings }));
    }
    setEditingToken(null);
    setEditingValue("");
  };

  const handleRemoveToken = (tokenId: string) => {
    dispatch(removeTokenFromWatchlist(tokenId));
    setShowMenu(null);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };


  const getSparklineColor = (token: any) => {
    const prices = token.sparkline_in_7d?.price;
    if (!prices || prices.length < 2) return "#9CA3AF";

    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];

    if (lastPrice > firstPrice) return "#10B981";
    if (lastPrice < firstPrice) return "#EF4444";
    return "#9CA3AF";
  };

  const generateSparklineData = (prices: number[]) => {
    return prices.map((price, index) => ({
      name: `Day ${index + 1}`,
      value: price,
    }));
  };

  if (watchlist.length === 0 && !isLoading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Star
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="#A9E851"
              style={{ color: "#A9E851" }}
            />
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Watchlist
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              <RefreshCw
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Refresh Prices</span>
              <span className="sm:hidden">Refresh</span>
            </button>
            <button
              onClick={onAddToken}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-black rounded-lg transition-colors text-sm sm:text-base"
              style={{ backgroundColor: "#A9E851" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "#9BD83F")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "#A9E851")
              }
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add Token</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-8">
          <p className="text-white text-lg mb-2">Your watchlist is empty.</p>
          <p className="text-gray-400">Add some tokens to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6 border-0">
        <div className="flex items-center space-x-2">
          <Star
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="#A9E851"
            style={{ color: "#A9E851" }}
          />
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Watchlist
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            <RefreshCw
              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh Prices</span>
          </button>
          <button
            onClick={onAddToken}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-black rounded-lg transition-colors text-sm sm:text-base"
            style={{ backgroundColor: "#A9E851" }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "#9BD83F")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "#A9E851")
            }
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add Token</span>
            <span className="sm:hidden">Add Token</span>
          </button>
        </div>
      </div>
      <div className="border border-gray-600 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr
                style={{ backgroundColor: "#27272A" }}
              >
                <th
                  className="text-left py-4 px-6 font-medium text-sm"
                  style={{ color: "#92929A" }}
                >
                  Token
                </th>
                <th
                  className="text-right py-4 px-6 font-medium text-sm"
                  style={{ color: "#92929A" }}
                >
                  Price
                </th>
                <th
                  className="text-right py-4 px-6 font-medium text-sm"
                  style={{ color: "#92929A" }}
                >
                  24h %
                </th>
                <th
                  className="text-center py-4 px-6 font-medium text-sm"
                  style={{ color: "#92929A" }}
                >
                  Sparkline (7d)
                </th>
                <th
                  className="text-right py-4 px-6 font-medium text-sm"
                  style={{ color: "#92929A" }}
                >
                  Holdings
                </th>
                <th
                  className="text-right py-4 px-6 font-medium text-sm"
                  style={{ color: "#92929A" }}
                >
                  Value
                </th>
                <th
                  className="text-center py-4 px-6 font-medium text-sm"
                  style={{ color: "#92929A" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedWatchlist.map((token) => (
                <tr
                  key={token.id}
                  className={`hover:bg-gray-800 transition-colors ${
                    editingToken === token.id ? "bg-gray-800" : ""
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={token.image}
                        alt={token.name}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-token.png";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-white text-sm">
                          {token.name}
                        </div>
                        <div className="text-sm text-gray-400 uppercase">
                          {token.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="font-medium text-white text-sm">
                      {formatCurrency(token.current_price)}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div
                      className={`flex items-center justify-end space-x-1 ${getPercentageColor(
                        token.price_change_percentage_24h
                      )}`}
                    >
                      {token.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <TrendingDown className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium">
                        {formatPercentage(token.price_change_percentage_24h)}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="w-20 h-8 mx-auto">
                      {token.sparkline_in_7d?.price ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={generateSparklineData(
                              token.sparkline_in_7d.price
                            )}
                          >
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={getSparklineColor(token)}
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">N/A</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {editingToken === token.id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <input
                          type="number"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="w-20 px-2 py-1 border rounded text-sm bg-gray-700 text-white focus:outline-none focus:ring-1"
                          style={
                            {
                              borderColor: "#A9E851",
                              "--tw-ring-color": "#A9E851",
                            } as React.CSSProperties
                          }
                          step="0.0001"
                          min="0"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveHoldings(token.id)}
                          className="px-3 py-1 text-black rounded text-sm transition-colors"
                          style={{ backgroundColor: "#A9E851" }}
                          onMouseEnter={(e) =>
                            ((
                              e.target as HTMLButtonElement
                            ).style.backgroundColor = "#9BD83F")
                          }
                          onMouseLeave={(e) =>
                            ((
                              e.target as HTMLButtonElement
                            ).style.backgroundColor = "#A9E851")
                          }
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end">
                        <span className="font-medium text-white text-sm">
                          {token.holdings.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="font-medium text-white text-sm">
                      {formatCurrency(token.value)}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="relative" ref={showMenu === token.id ? menuRef : null}>
                      <button
                        onClick={() =>
                          setShowMenu(showMenu === token.id ? null : token.id)
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {showMenu === token.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-gray-800 rounded-md shadow-lg border border-gray-600 z-10">
                          <button
                            onClick={() => {
                              handleEditHoldings(token.id, token.holdings);
                              setShowMenu(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                          >
                            <Edit2 className="inline-block w-4 h-4 mr-2" /> Edit Holdings
                          </button>
                          <button
                            onClick={() => handleRemoveToken(token.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                          >
                            <Trash2 className="inline-block w-4 h-4 mr-2" />{" "}
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {watchlist.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-600">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="text-sm" style={{ color: "#92929A" }}>
                Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, watchlist.length)} of{" "}
                {watchlist.length} tokens
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
                  title="First page"
                >
                  ««
                </button>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
                  title="Previous page"
                >
                  ‹ Prev
                </button>

                <div className="flex items-center space-x-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-2 py-1 text-sm border rounded ${
                          currentPage === pageNum
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "border-gray-600 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
                  title="Next page"
                >
                  Next ›
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
                  title="Last page"
                >
                  »»
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
