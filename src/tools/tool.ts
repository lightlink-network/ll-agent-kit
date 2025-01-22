import type { Network, NetworkManager } from "../network.js";
import type { WalletProvider } from "../wallet.js";

// A tool function that has access to the private key and network
export type WalletToolFn<T, R> = (
  wallet: WalletProvider,
  networkManager: NetworkManager,
  params: T
) => Promise<R>;

// Wraps a tool function with a wallet, giving it access to the private key
// This is useful for tools that need to sign transactions
export const withWallet = <T, R>(
  wallet: WalletProvider,
  networks: NetworkManager,
  fn: WalletToolFn<T, R>
) => {
  return (params: T) => fn(wallet, networks, params);
};

export type TxResult = {
  status: "success" | "failed";
  txHash: string;
};
