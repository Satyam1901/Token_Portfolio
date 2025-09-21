import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import type { ChartData } from '../types';
import { formatCurrency } from '../utils/helpers';

interface PortfolioDonutChartProps {
  data: ChartData[];
  totalValue: number;
}


const renderCustomizedLabel = () => {
  return null;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-gray-800 p-3 border border-gray-600 rounded-lg shadow-lg">
        <p className="font-semibold text-white">{data.payload.name}</p>
        <p className="text-green-500">{formatCurrency(data.value)}</p>
        <p className="text-gray-400 text-sm">{data.payload.percentage.toFixed(1)}% of portfolio</p>
      </div>
    );
  }
  return null;
};

export const PortfolioDonutChart: React.FC<PortfolioDonutChartProps> = ({
  data,
  totalValue,
}) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-400">No tokens in portfolio</p>
          <p className="text-sm text-gray-500">Add tokens to see your portfolio breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto lg:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
            <p className="text-xs sm:text-sm text-gray-400">Total Value</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:flex-1 mt-6 lg:mt-0">
        <div className="space-y-2 sm:space-y-3 w-full">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs sm:text-sm text-white font-medium">{entry.name} ({entry.symbol || entry.name.split(' ')[0].substring(0, 3).toUpperCase()})</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-400 font-medium">{entry.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};