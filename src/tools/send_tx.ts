// Send wraps signer.sendTransaction

import { z } from "zod";
import { makeNetworkProvider } from "../network.js";
import type { WalletToolFn } from "./tool.js";
import { parseEther, Wallet } from "ethers";

export const SendTxParamsSchema = z.object({
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

export const sendTx: WalletToolFn<SendTxParams> = async (
  privateKey,
  network,
  params
) => {
  const provider = makeNetworkProvider(network);
  const wallet = new Wallet(privateKey, provider);

  const tx = await wallet.sendTransaction({
    to: params.to,
    value: params.amount ? parseEther(params.amount) : undefined,
    data: params.calldata,
  });
  await tx.wait();

  return JSON.stringify({
    status: "success",
    txHash: tx.hash,
  });
};
