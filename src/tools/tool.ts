import type { Network } from "../network.js";
import type { WalletProvider } from "../wallet.js";

// A tool function that has access to the private key and network
export type WalletToolFn<T, R> = (
  wallet: WalletProvider,
  params: T
) => Promise<R>;

// Wraps a tool function with a wallet, giving it access to the private key
// This is useful for tools that need to sign transactions
export const withWallet = <T, R>(
  wallet: WalletProvider,
  fn: WalletToolFn<T, R>
) => {
  return (params: T) => fn(wallet, params);
};

export type TxResult = {
  status: "success" | "failed";
  txHash: string;
};
