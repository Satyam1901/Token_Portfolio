# Token Portfolio

A comprehensive token portfolio management application built with React, TypeScript, and modern web3 technologies.

## Features

### 🏠 Portfolio Dashboard
- **Portfolio Total Card**: Displays total portfolio value with 24h change
- **Donut Chart**: Visual representation of portfolio allocation
- **Last Updated**: Timestamp showing when prices were last refreshed
- **Real-time Price Updates**: Automatic price refresh functionality

### 📊 Watchlist Table
- **Token Information**: Name, symbol, logo, and current price
- **24h Performance**: Price change percentage with color-coded indicators
- **7-day Sparkline**: Mini charts showing price trends
- **Editable Holdings**: Click to edit token holdings with real-time value calculation
- **Portfolio Value**: Calculated as holdings × current price
- **Row Actions**: Edit holdings or remove tokens from watchlist
- **Pagination**: Navigate through large token lists

### ➕ Add Token Modal
- **Search Functionality**: Real-time search using CoinGecko API
- **Trending Tokens**: Discover popular tokens
- **Token Selection**: Multi-select tokens to add to watchlist
- **Duplicate Prevention**: Prevents adding tokens already in watchlist

### 🔗 Wallet Integration
- **WalletConnect Support**: Connect using RainbowKit
- **Multi-chain Support**: Ethereum, Polygon, Arbitrum, Optimism, Base, and Sepolia
- **Address Display**: Shows connected wallet address
- **Connection Status**: Visual indicators for wallet connection state

### 💾 Data Persistence
- **localStorage**: Watchlist and holdings persist across sessions
- **Automatic Restoration**: Portfolio restores when user returns
- **Real-time Sync**: Portfolio values update with price changes

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Adaptive Layout**: Components adjust for desktop and mobile
- **Touch-Friendly**: Optimized for touch interactions

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Web3**: wagmi, RainbowKit, viem
- **API**: CoinGecko API
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd token-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── AddTokenModal.tsx
│   ├── WatchlistTable.tsx
│   └── WalletConnect.tsx
├── charts/             # Chart components
│   └── PortfolioDonutChart.tsx
├── config/             # Configuration files
│   └── wagmi.ts
├── hooks/              # Custom React hooks
│   ├── redux.ts
│   └── useWallet.ts
├── services/           # API services
│   └── coinGeckoService.ts
├── store/              # Redux store
│   ├── index.ts
│   └── slices/
│       ├── portfolioSlice.ts
│       └── walletSlice.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── helpers.tsx
├── App.tsx             # Main application component
├── PortfolioSummary.tsx
└── main.tsx            # Application entry point
```

## Key Features Implementation

### State Management
- **Redux Toolkit**: Centralized state management
- **Portfolio Slice**: Manages watchlist, holdings, and portfolio calculations
- **Wallet Slice**: Handles wallet connection state
- **Persistence**: Automatic localStorage integration

### API Integration
- **CoinGecko Service**: Fetches token data, prices, and trending tokens
- **Real-time Updates**: Automatic price refresh functionality
- **Error Handling**: Graceful error handling and loading states

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg responsive breakpoints
- **Adaptive Components**: Components adjust based on screen size

## Deployment

- **Vercel**: `vercel --prod`

## Environment Variables

For production deployment, you may want to configure:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

Get your WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com/)
