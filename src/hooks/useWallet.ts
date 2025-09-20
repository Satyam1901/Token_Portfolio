import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  setWalletConnected,
  setWalletDisconnected,
  setWalletLoading,
  setWalletError,
} from '../store/slices/walletSlice';

export const useWallet = () => {
  const dispatch = useDispatch();
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && address && chainId) {
      dispatch(setWalletConnected({ address, chainId }));
    } else {
      dispatch(setWalletDisconnected());
    }
  }, [isConnected, address, chainId, dispatch]);

  useEffect(() => {
    dispatch(setWalletLoading(isPending));
  }, [isPending, dispatch]);

  const connectWallet = async (connectorId: string) => {
    try {
      const connector = connectors.find(c => c.id === connectorId);
      if (connector) {
        await connect({ connector });
      }
    } catch (error) {
      dispatch(setWalletError(error instanceof Error ? error.message : 'Failed to connect wallet'));
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    address,
    isConnected,
    chainId,
    connectors,
    isPending,
    connectWallet,
    disconnectWallet,
  };
};
