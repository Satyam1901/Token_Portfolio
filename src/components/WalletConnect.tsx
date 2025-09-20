import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '../hooks/useWallet';
import { truncateAddress } from '../utils/helpers';
import { Wallet } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { address, isConnected } = useWallet();

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      {isConnected && address && (
        <div className="hidden sm:flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg" style={{ backgroundColor: '#A9E851', border: '1px solid #A9E851' }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#000000' }}></div>
          <span className="text-xs sm:text-sm font-medium text-black">
            {truncateAddress(address)}
          </span>
        </div>
      )}
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-black rounded-lg transition-colors font-medium text-xs sm:text-sm lg:text-base"
                      style={{ backgroundColor: '#A9E851' }}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#9BD83F'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#A9E851'}
                    >
                      <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Connect Wallet</span>
                      <span className="sm:hidden">Connect</span>
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <span>Wrong network</span>
                    </button>
                  );
                }

                return (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};
