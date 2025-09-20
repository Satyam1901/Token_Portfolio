import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Token Portfolio',
  projectId: 'YOUR_PROJECT_ID', // Get this from https://cloud.walletconnect.com/
  chains: [mainnet, polygon, arbitrum, optimism, base, sepolia],
  ssr: false, 
});
