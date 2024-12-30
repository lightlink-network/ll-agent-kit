import type { Network } from "../network.js";
import type { WalletProvider } from "../wallet.js";

// A tool function that has access to the private key and network
export type WalletToolFn<T> = (
  privateKey: string,
  network: Network,
  params: T
) => Promise<any>;

// Wraps a tool function with a wallet, giving it access to the private key
// This is useful for tools that need to sign transactions
export const withWallet = <T>(agent: WalletProvider, fn: WalletToolFn<T>) => {
  return (params: T) => fn(agent.getPrivateKey(), agent.getNetwork(), params);
};
