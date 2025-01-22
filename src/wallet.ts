import { Wallet, type Transaction } from "ethers";
import { makeNetworkProvider, type Network } from "./network.js";
import type { TransactionRequest, TransactionResponse } from "ethers";

export interface WalletProvider {
  signTransaction: (network: Network, tx: Transaction) => Promise<string>;
  sendTransaction: (
    network: Network,
    tx: TransactionRequest
  ) => Promise<TransactionResponse>;
  getAddress: () => Promise<string>;
}

export class PrivateKeyWalletProvider implements WalletProvider {
  privateKey: string;

  constructor(privateKey: string) {
    this.privateKey = privateKey;
  }

  async getAddress() {
    return await new Wallet(this.privateKey).getAddress();
  }

  async signTransaction(network: Network, tx: Transaction) {
    tx.chainId = network.chainId;
    return await new Wallet(this.privateKey).signTransaction(tx);
  }

  async sendTransaction(network: Network, tx: TransactionRequest) {
    const provider = makeNetworkProvider(network);
    return await new Wallet(this.privateKey, provider).sendTransaction(tx);
  }
}
