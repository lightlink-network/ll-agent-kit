import type { TransactionRequest, TransactionResponse } from "ethers";

export interface WalletProvider {
  getAddress: () => Promise<string>;
  sendTransaction: (tx: TransactionRequest) => Promise<TransactionResponse>;
}
