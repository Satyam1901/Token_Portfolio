import type { WatchlistToken } from '../types';

export const sampleTokens: WatchlistToken[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 85432.10,
    price_change_percentage_24h: -1.20,
    sparkline_in_7d: {
      price: [86000, 85800, 85500, 85200, 85000, 85600, 85432.10]
    },
    market_cap_rank: 1,
    holdings: 0.12,
    value: 11600.00, // 52.3% of total
    color: '#F97316' // Orange
  },
  {
    id: 'stellar',
    name: 'Stellar',
    symbol: 'XLM',
    image: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
    current_price: 0.0923,
    price_change_percentage_24h: 4.70,
    sparkline_in_7d: {
      price: [0.085, 0.087, 0.089, 0.088, 0.091, 0.093, 0.0923]
    },
    market_cap_rank: 25,
    holdings: 30000,
    value: 6250.00, // 28.2% of total
    color: '#3B82F6' // Blue
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 196.45,
    price_change_percentage_24h: 4.70,
    sparkline_in_7d: {
      price: [180, 185, 190, 188, 195, 200, 196.45]
    },
    market_cap_rank: 5,
    holdings: 9.2,
    value: 1800.00, // 8.1% of total
    color: '#EC4899' // Pink
  },
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.4325,
    price_change_percentage_24h: 3.30,
    sparkline_in_7d: {
      price: [0.40, 0.41, 0.42, 0.415, 0.425, 0.43, 0.4325]
    },
    market_cap_rank: 8,
    holdings: 2800,
    value: 1330.00, // 6.0% of total
    color: '#10B981' // Green
  },
  {
    id: 'usd-coin',
    name: 'USD Coin',
    symbol: 'USDC',
    image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    current_price: 1.00,
    price_change_percentage_24h: 0.00,
    sparkline_in_7d: {
      price: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]
    },
    market_cap_rank: 3,
    holdings: 1000,
    value: 1000.00, // 4.5% of total
    color: '#06B6D4' // Cyan
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 43250.67,
    price_change_percentage_24h: 2.30,
    sparkline_in_7d: {
      price: [42000, 42500, 43000, 42800, 43200, 43500, 43250.67]
    },
    market_cap_rank: 2,
    holdings: 0.05,
    value: 220.00, // 1.0% of total
    color: '#8B5CF6' // Purple
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.45,
    price_change_percentage_24h: -2.10,
    sparkline_in_7d: {
      price: [0.46, 0.455, 0.45, 0.448, 0.452, 0.45, 0.45]
    },
    market_cap_rank: 8,
    holdings: 2000,
    value: 900.00,
    color: '#8B5CF6' // Purple
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    current_price: 6.25,
    price_change_percentage_24h: 1.80,
    sparkline_in_7d: {
      price: [6.0, 6.1, 6.2, 6.15, 6.3, 6.25, 6.25]
    },
    market_cap_rank: 12,
    holdings: 100,
    value: 625.00,
    color: '#F97316' // Orange
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    current_price: 14.50,
    price_change_percentage_24h: 3.20,
    sparkline_in_7d: {
      price: [14.0, 14.2, 14.3, 14.1, 14.4, 14.5, 14.5]
    },
    market_cap_rank: 15,
    holdings: 50,
    value: 725.00,
    color: '#EC4899' // Pink
  },
  {
    id: 'litecoin',
    name: 'Litecoin',
    symbol: 'LTC',
    image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
    current_price: 85.30,
    price_change_percentage_24h: -0.80,
    sparkline_in_7d: {
      price: [86, 85.5, 85, 85.2, 85.4, 85.3, 85.3]
    },
    market_cap_rank: 10,
    holdings: 5,
    value: 426.50,
    color: '#10B981' // Green
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    symbol: 'UNI',
    image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
    current_price: 7.25,
    price_change_percentage_24h: 2.50,
    sparkline_in_7d: {
      price: [7.0, 7.1, 7.2, 7.15, 7.3, 7.25, 7.25]
    },
    market_cap_rank: 20,
    holdings: 100,
    value: 725.00,
    color: '#06B6D4' // Cyan
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    current_price: 32.15,
    price_change_percentage_24h: 4.10,
    sparkline_in_7d: {
      price: [30, 31, 32, 31.5, 32.5, 32.2, 32.15]
    },
    market_cap_rank: 9,
    holdings: 20,
    value: 643.00,
    color: '#3B82F6' // Blue
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    current_price: 0.85,
    price_change_percentage_24h: -1.50,
    sparkline_in_7d: {
      price: [0.86, 0.855, 0.85, 0.848, 0.852, 0.85, 0.85]
    },
    market_cap_rank: 18,
    holdings: 1000,
    value: 850.00,
    color: '#8B5CF6' // Purple
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    symbol: 'ATOM',
    image: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
    current_price: 8.75,
    price_change_percentage_24h: 1.20,
    sparkline_in_7d: {
      price: [8.6, 8.7, 8.75, 8.7, 8.8, 8.75, 8.75]
    },
    market_cap_rank: 25,
    holdings: 80,
    value: 700.00,
    color: '#F97316' // Orange
  },
  {
    id: 'algorand',
    name: 'Algorand',
    symbol: 'ALGO',
    image: 'https://assets.coingecko.com/coins/images/4380/large/download.png',
    current_price: 0.18,
    price_change_percentage_24h: 2.80,
    sparkline_in_7d: {
      price: [0.17, 0.175, 0.18, 0.178, 0.182, 0.18, 0.18]
    },
    market_cap_rank: 30,
    holdings: 5000,
    value: 900.00,
    color: '#EC4899' // Pink
  },
  {
    id: 'filecoin',
    name: 'Filecoin',
    symbol: 'FIL',
    image: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png',
    current_price: 4.25,
    price_change_percentage_24h: -1.20,
    sparkline_in_7d: {
      price: [4.3, 4.28, 4.25, 4.22, 4.26, 4.24, 4.25]
    },
    market_cap_rank: 35,
    holdings: 200,
    value: 850.00,
    color: '#10B981' // Green
  },
  {
    id: 'vechain',
    name: 'VeChain',
    symbol: 'VET',
    image: 'https://assets.coingecko.com/coins/images/1167/large/VeChain-Logo-768x725.png',
    current_price: 0.025,
    price_change_percentage_24h: 3.50,
    sparkline_in_7d: {
      price: [0.024, 0.0245, 0.025, 0.0248, 0.0252, 0.025, 0.025]
    },
    market_cap_rank: 40,
    holdings: 30000,
    value: 750.00,
    color: '#3B82F6' // Blue
  },
  {
    id: 'tezos',
    name: 'Tezos',
    symbol: 'XTZ',
    image: 'https://assets.coingecko.com/coins/images/976/large/Tezos-logo.png',
    current_price: 0.95,
    price_change_percentage_24h: 1.80,
    sparkline_in_7d: {
      price: [0.93, 0.94, 0.95, 0.945, 0.96, 0.95, 0.95]
    },
    market_cap_rank: 45,
    holdings: 800,
    value: 760.00,
    color: '#8B5CF6' // Purple
  },
  {
    id: 'monero',
    name: 'Monero',
    symbol: 'XMR',
    image: 'https://assets.coingecko.com/coins/images/69/large/monero_logo.png',
    current_price: 165.50,
    price_change_percentage_24h: -0.50,
    sparkline_in_7d: {
      price: [166, 165.8, 165.5, 165.2, 165.7, 165.5, 165.5]
    },
    market_cap_rank: 50,
    holdings: 4,
    value: 662.00,
    color: '#F97316' // Orange
  }
];