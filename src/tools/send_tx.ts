// Send wraps signer.sendTransaction

import { z } from "zod";
import { makeNetworkProvider } from "../network.js";
import type { TxResult, WalletToolFn } from "./tool.js";
import { parseEther, Wallet } from "ethers";
import type { ChainId } from "@elektrik/sdk-core";

export const SendTxParamsSchema = z.object({
  chainId: z.number().describe("The chainId to send the transaction on"),
  to: z.string().optional().describe("The target of the transaction"),
  amount: z.string().optional().describe("The amount to send e.g 5.4321"),
  calldata: z.string().optional().describe("The calldata to send as hex"),
});

export type SendTxParams = z.infer<typeof SendTxParamsSchema>;

export const SendTxToolDefinition = {
  name: "send_transaction",
  description: "Send a raw ethereum transaction",
  schema: SendTxParamsSchema,
};

export const sendTx: WalletToolFn<SendTxParams, TxResult> = async (
  walletProvider,
  networks,
  params
) => {
  console.log("[tool:send_tx]: sending transaction", params);
  const network = networks.findNetwork(params.chainId);
  if (!network) {
    throw new Error(`Network with chainId ${params.chainId} not found`);
  }

  const tx = await walletProvider.sendTransaction(network, {
    to: params.to,
    value: params.amount ? parseEther(params.amount) : undefined,
    data: params.calldata,
  });
  await tx.wait();

  return {
    status: "success",
    txHash: tx.hash,
  };
};
