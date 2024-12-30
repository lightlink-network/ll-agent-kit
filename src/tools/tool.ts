import type { Network } from "../network.js";

// An agent that has access to a private key and network
export interface AgentWithWallet {
  getPrivateKey: () => string;
  getNetwork: () => Network;
}

// A tool function that has access to the private key and network
export type WalletToolFn<T> = (
  privateKey: string,
  network: Network,
  params: T
) => Promise<any>;

// Wraps a tool function with a wallet, giving it access to the private key
// This is useful for tools that need to sign transactions
export const withWallet = <T>(agent: AgentWithWallet, fn: WalletToolFn<T>) => {
  return (params: T) => fn(agent.getPrivateKey(), agent.getNetwork(), params);
};
