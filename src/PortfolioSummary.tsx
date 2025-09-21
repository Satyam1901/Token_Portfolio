import React from "react";
import { PortfolioDonutChart } from "./charts/PortfolioDonutChart";
import type { ChartData } from "./types";
import { formatCurrency, formatTimeAgo } from "./utils/helpers";

interface PortfolioSummaryProps {
  totalValue: number;
  chartData: ChartData[];
  lastUpdated: string | null;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  totalValue,
  chartData,
  lastUpdated,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="block lg:hidden">
        <div className="card">
          <div className="mb-6">
            <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
              Portfolio Total
            </h2>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {formatCurrency(totalValue)}
            </div>
            {lastUpdated && (
              <p className="text-xs text-gray-400">
                Last updated: {formatTimeAgo(lastUpdated)}
              </p>
            )}
          </div>
          <PortfolioDonutChart data={chartData} totalValue={totalValue} />
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="flex flex-col justify-between text-left">
              <div>
                <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Portfolio Total
                </h2>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {formatCurrency(totalValue)}
                </div>
              </div>
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Last updated: {formatTimeAgo(lastUpdated)}
                </p>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <PortfolioDonutChart data={chartData} totalValue={totalValue} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
