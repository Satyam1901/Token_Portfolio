import axios from "axios";
import type { Token, CoinGeckoResponse, TrendingToken } from "../types";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

class CoinGeckoService {
  private api = axios.create({
    baseURL: COINGECKO_API_BASE,
    timeout: 10000,
  });

  // Get token prices for specific token IDs
  async getTokenPrices(tokenIds: string[]): Promise<Token[]> {
    try {
      const response = await this.api.get("/coins/markets", {
        params: {
          vs_currency: "usd",
          ids: tokenIds.join(","),
          order: "market_cap_desc",
          per_page: 250,
          page: 1,
          sparkline: true,
          price_change_percentage: "24h",
        },
      });

      return response.data.map((token: CoinGeckoResponse) => ({
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        image: token.image,
        current_price: token.current_price,
        price_change_percentage_24h: token.price_change_percentage_24h || 0,
        sparkline_in_7d: token.sparkline_in_7d,
        market_cap_rank: token.market_cap_rank,
      }));
    } catch (error) {
      console.error("Error fetching token prices:", error);
      throw new Error("Failed to fetch token prices");
    }
  }

  // Get paginated token prices for specific token IDs
  async getTokenPricesPaginated(
    tokenIds: string[],
    page: number = 1,
    perPage: number = 10
  ): Promise<{ tokens: Token[]; totalCount: number; hasMore: boolean }> {
    try {
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedTokenIds = tokenIds.slice(startIndex, endIndex);

      if (paginatedTokenIds.length === 0) {
        return { tokens: [], totalCount: tokenIds.length, hasMore: false };
      }

      const response = await this.api.get("/coins/markets", {
        params: {
          vs_currency: "usd",
          ids: paginatedTokenIds.join(","),
          order: "market_cap_desc",
          per_page: perPage,
          page: 1,
          sparkline: true,
          price_change_percentage: "24h",
        },
      });

      const tokens = response.data.map((token: CoinGeckoResponse) => ({
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        image: token.image,
        current_price: token.current_price,
        price_change_percentage_24h: token.price_change_percentage_24h || 0,
        sparkline_in_7d: token.sparkline_in_7d,
        market_cap_rank: token.market_cap_rank,
      }));

      return {
        tokens,
        totalCount: tokenIds.length,
        hasMore: endIndex < tokenIds.length,
      };
    } catch (error) {
      console.error("Error fetching paginated token prices:", error);
      throw new Error("Failed to fetch paginated token prices");
    }
  }

  // Search for tokens by query
  async searchTokens(query: string): Promise<Token[]> {
    try {
      if (!query.trim()) {
        return [];
      }

      console.log("Searching for tokens with query:", query);

      const response = await this.api.get("/search", {
        params: {
          query: query.trim(),
        },
      });

      console.log("Search response:", response.data);

      if (!response.data.coins || response.data.coins.length === 0) {
        console.log("No coins found in search results");
        return [];
      }

      const coinIds = response.data.coins
        .slice(0, 20) // Limit to top 20 results
        .map((coin: any) => coin.id);

      console.log("Found coin IDs:", coinIds);

      if (coinIds.length === 0) {
        return [];
      }

      const tokenPrices = await this.getTokenPrices(coinIds);
      console.log("Token prices fetched:", tokenPrices);
      return tokenPrices;
    } catch (error) {
      console.error("Error searching tokens:", error);

      // Return sample search results as fallback
      const sampleTokens = [
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          image:
            "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          current_price: 45000,
          price_change_percentage_24h: 2.5,
          sparkline_in_7d: { price: [44000, 44500, 44800, 45200, 45000] },
          market_cap_rank: 1,
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          image:
            "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
          current_price: 3200,
          price_change_percentage_24h: -1.2,
          sparkline_in_7d: { price: [3250, 3230, 3200, 3180, 3200] },
          market_cap_rank: 2,
        },
        {
          id: "solana",
          name: "Solana",
          symbol: "SOL",
          image:
            "https://assets.coingecko.com/coins/images/4128/large/solana.png",
          current_price: 180,
          price_change_percentage_24h: 5.8,
          sparkline_in_7d: { price: [170, 175, 178, 182, 180] },
          market_cap_rank: 5,
        },
        {
          id: "cardano",
          name: "Cardano",
          symbol: "ADA",
          image:
            "https://assets.coingecko.com/coins/images/975/large/cardano.png",
          current_price: 0.45,
          price_change_percentage_24h: 3.1,
          sparkline_in_7d: { price: [0.43, 0.44, 0.45, 0.46, 0.45] },
          market_cap_rank: 8,
        },
        {
          id: "dogecoin",
          name: "Dogecoin",
          symbol: "DOGE",
          image:
            "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
          current_price: 0.08,
          price_change_percentage_24h: -2.3,
          sparkline_in_7d: { price: [0.082, 0.081, 0.08, 0.079, 0.08] },
          market_cap_rank: 10,
        },
        {
          id: "chainlink",
          name: "Chainlink",
          symbol: "LINK",
          image:
            "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
          current_price: 15.5,
          price_change_percentage_24h: 1.8,
          sparkline_in_7d: { price: [15.2, 15.3, 15.4, 15.6, 15.5] },
          market_cap_rank: 12,
        },
        {
          id: "litecoin",
          name: "Litecoin",
          symbol: "LTC",
          image:
            "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
          current_price: 75,
          price_change_percentage_24h: -0.5,
          sparkline_in_7d: { price: [75.5, 75.2, 75, 74.8, 75] },
          market_cap_rank: 15,
        },
        {
          id: "polkadot",
          name: "Polkadot",
          symbol: "DOT",
          image:
            "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
          current_price: 6.8,
          price_change_percentage_24h: 4.2,
          sparkline_in_7d: { price: [6.5, 6.6, 6.7, 6.9, 6.8] },
          market_cap_rank: 18,
        },
      ];

      // Filter by query if provided
      if (query.toLowerCase()) {
        const filtered = sampleTokens.filter(
          (token) =>
            token.name.toLowerCase().includes(query.toLowerCase()) ||
            token.symbol.toLowerCase().includes(query.toLowerCase())
        );
        console.log("Filtered sample tokens:", filtered);
        return filtered;
      }

      console.log("Returning all sample tokens");
      return sampleTokens;
    }
  }

  // Get trending tokens
  async getTrendingTokens(): Promise<TrendingToken[]> {
    try {
      const response = await this.api.get("/search/trending");

      const trendingCoins = response.data.coins.slice(0, 10); // Top 10 trending

      const coinIds = trendingCoins.map((coin: any) => coin.item.id);
      const tokenData = await this.getTokenPrices(coinIds);

      return trendingCoins.map((coin: any) => {
        const token = tokenData.find((t) => t.id === coin.item.id);
        return {
          id: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
          image: coin.item.thumb,
          market_cap_rank: coin.item.market_cap_rank,
          price_change_percentage_24h: token?.price_change_percentage_24h || 0,
        };
      });
    } catch (error) {
      console.error("Error fetching trending tokens:", error);
      // Return sample trending tokens as fallback
      return [
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          image:
            "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          market_cap_rank: 1,
          price_change_percentage_24h: 2.5,
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          image:
            "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
          market_cap_rank: 2,
          price_change_percentage_24h: -1.2,
        },
        {
          id: "solana",
          name: "Solana",
          symbol: "SOL",
          image:
            "https://assets.coingecko.com/coins/images/4128/large/solana.png",
          market_cap_rank: 5,
          price_change_percentage_24h: 5.8,
        },
        {
          id: "cardano",
          name: "Cardano",
          symbol: "ADA",
          image:
            "https://assets.coingecko.com/coins/images/975/large/cardano.png",
          market_cap_rank: 8,
          price_change_percentage_24h: 3.1,
        },
        {
          id: "dogecoin",
          name: "Dogecoin",
          symbol: "DOGE",
          image:
            "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
          market_cap_rank: 10,
          price_change_percentage_24h: -2.3,
        },
      ];
    }
  }

  // Get top tokens by market cap
  async getTopTokens(limit: number = 50): Promise<Token[]> {
    try {
      const response = await this.api.get("/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: limit,
          page: 1,
          sparkline: true,
          price_change_percentage: "24h",
        },
      });

      return response.data.map((token: CoinGeckoResponse) => ({
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        image: token.image,
        current_price: token.current_price,
        price_change_percentage_24h: token.price_change_percentage_24h || 0,
        sparkline_in_7d: token.sparkline_in_7d,
        market_cap_rank: token.market_cap_rank,
      }));
    } catch (error) {
      console.error("Error fetching top tokens:", error);
      throw new Error("Failed to fetch top tokens");
    }
  }

  // Get token details by ID
  async getTokenDetails(tokenId: string): Promise<Token> {
    try {
      const response = await this.api.get(`/coins/${tokenId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true,
        },
      });

      const data = response.data;
      return {
        id: data.id,
        name: data.name,
        symbol: data.symbol,
        image: data.image?.small || data.image?.thumb,
        current_price: data.market_data?.current_price?.usd || 0,
        price_change_percentage_24h:
          data.market_data?.price_change_percentage_24h || 0,
        sparkline_in_7d: data.market_data?.sparkline_7d,
        market_cap_rank: data.market_cap_rank,
      };
    } catch (error) {
      console.error("Error fetching token details:", error);
      throw new Error("Failed to fetch token details");
    }
  }
}

export const coinGeckoService = new CoinGeckoService();
