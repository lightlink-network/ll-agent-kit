import { z } from "zod";
import { makeNetworkProvider } from "../network.js";
import type { TxResult, WalletToolFn } from "./tool.js";
import { Contract, parseEther, parseUnits, Wallet } from "ethers";
import { ERC20ABI } from "../abis/erc20.js";

const TransferParamsSchema = z.object({
  chainId: z.number().describe("The chainId to transfer on"),
  to: z.string().describe("The wallet address to transfer to"),
  amount: z.number().describe("The amount to transfer e.g 5.4321"),
  token: z
    .string()
    .optional()
    .describe(
      "The token contract address. If omitted, transfers native currency (e.g. ETH)"
    ),
});

export type TransferParams = z.infer<typeof TransferParamsSchema>;

export const TransferToolDefinition = {
  name: "transfer",
  description: "Transfer any token or native currency to a wallet",
  schema: TransferParamsSchema,
};

export const transfer: WalletToolFn<TransferParams, TxResult> = async (
  wallet,
  networks,
  params
) => {
  const network = networks.findNetwork(params.chainId);
  if (!network)
    throw new Error(`Network with chainId ${params.chainId} not found`);

  if (!params.token) {
    console.log("[tool:transfer]: transferring native currency", params);
    const tx = await wallet.sendTransaction(network, {
      to: params.to,
      value: parseEther(params.amount.toString()),
    });

    // wait for the transaction to be mined
    await tx.wait();

    // return the transaction hash
    return {
      status: "success",
      txHash: tx.hash,
    };
  }

  // get the token contract
  const provider = makeNetworkProvider(network);

  console.log("[tool:transfer]: transferring token", params);
  const token = new Contract(params.token, ERC20ABI, provider);
  if (!token.transfer || !token.decimals) {
    throw new Error("Internal error: Incorrect ERC20 ABI");
  }

  const callData = token.interface.encodeFunctionData("transfer", [
    params.to,
    parseUnits(params.amount.toString(), await token.decimals()),
  ]);

  const tx = await wallet.sendTransaction(network, {
    to: params.token,
    data: callData,
  });

  // wait for the transaction to be mined
  await tx.wait();

  // return the transaction hash
  return {
    status: "success",
    txHash: tx.hash,
  };
};
