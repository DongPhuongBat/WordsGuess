import { useLucid } from '../context/LucidProvider';
import { useState } from 'react';
import { FaWallet } from 'react-icons/fa';

export function WalletConnect() {
  const { connectWallet, disconnectWallet, address, walletType } = useLucid();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await connectWallet('nami');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      {!address ? (
        <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 shadow-2xl border border-blue-200">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <FaWallet className="mr-2" /> Wallet Connect
          </h2>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full px-5 py-3 rounded-lg bg-white text-blue-600 hover:text-blue-700 hover:shadow-lg font-semibold text-lg 
                       transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting...' : 'Connect Nami'}
          </button>
          {error && (
            <div className="mt-4 p-3 rounded bg-red-100 border border-red-400 text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 shadow-2xl border border-blue-300">
          <div>
            <h2 className="text-sm font-semibold text-white">Connected Wallet</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white font-mono text-base">{formatAddress(address)}</span>
              <span className="px-2 py-1 rounded-full bg-white/20 text-white text-xs uppercase">
                {walletType}
              </span>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 rounded-lg bg-white text-blue-600 hover:text-blue-700 hover:shadow-lg font-semibold text-sm transition duration-300"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
