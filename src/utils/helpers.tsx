import { format, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (value: number, decimals: number = 2): string => {
  if (value === 0) return '$0.00';

  if (value < 0.01) {
    return `$${value.toFixed(6)}`;
  }

  if (value < 1) {
    return `$${value.toFixed(4)}`;
  }

  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }

  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }

  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }

  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
};

export const formatPercentage = (value: number): string => {
  if (isNaN(value)) return '0.00%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const formatNumber = (value: number): string => {
  if (value === 0) return '0';

  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  }

  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }

  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }

  return value.toLocaleString();
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const formatTimeAgo = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const getPercentageColor = (percentage: number): string => {
  if (percentage > 0) return 'text-green-500';
  if (percentage < 0) return 'text-red-500';
  return 'text-gray-400';
};

export const generateChartColors = (count: number): string[] => {
  const colors = [
    '#8B5CF6',
    '#EC4899',
    '#10B981',
    '#06B6D4',
    '#3B82F6',
    '#F59E0B',
    '#EF4444',
    '#84CC16',
    '#6366F1',
  ];

  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const truncateAddress = (address: string, chars: number = 4): string => {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};