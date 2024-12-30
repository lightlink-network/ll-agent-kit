import type { Network } from "./network.js";

export interface WalletProvider {
  getPrivateKey: () => string;
  getNetwork: () => Network;
}
