import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  chainId: null,
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletConnected: (state, action: PayloadAction<{ address: string; chainId: number }>) => {
      state.isConnected = true;
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.error = null;
    },
    setWalletDisconnected: (state) => {
      state.isConnected = false;
      state.address = null;
      state.chainId = null;
      state.error = null;
    },
    setWalletLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setWalletError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearWalletError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setWalletConnected,
  setWalletDisconnected,
  setWalletLoading,
  setWalletError,
  clearWalletError,
} = walletSlice.actions;

export default walletSlice.reducer;
