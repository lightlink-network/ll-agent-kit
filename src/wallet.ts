import { Wallet, type Transaction } from "ethers";
import type { Network } from "./network.js";
import type { TransactionRequest, TransactionResponse } from "ethers";

export interface WalletProvider {
  signTransaction: (tx: Transaction) => Promise<string>;
  sendTransaction: (tx: TransactionRequest) => Promise<TransactionResponse>;
  getAddress: () => Promise<string>;
  getNetworkInfo: () => Network;
}

export class PrivateKeyWalletProvider implements WalletProvider {
  privateKey: string;
  network: Network;

  constructor(privateKey: string, network: Network) {
    this.privateKey = privateKey;
    this.network = network;
  }

  async getAddress() {
    return await new Wallet(this.privateKey).getAddress();
  }

  async signTransaction(tx: Transaction) {
    return await new Wallet(this.privateKey).signTransaction(tx);
  }

  async sendTransaction(tx: TransactionRequest) {
    return await new Wallet(this.privateKey).sendTransaction(tx);
  }

  getNetworkInfo() {
    return this.network;
  }
}
