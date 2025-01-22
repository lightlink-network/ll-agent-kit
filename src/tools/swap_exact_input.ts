import { Contract, parseUnits, Wallet } from "ethers";
import type { TxResult, WalletToolFn } from "./tool.js";
import { makeNetworkProvider } from "../network.js";
import { z } from "zod";
import { ERC20ABI } from "../abis/erc20.js";
import { swapExactIn } from "../elektrik/swap.js";

export const SwapExactInputToolDefinition = {
  name: "swap_exact_input",
  description:
    "Swap exact input in the Elektrik DEX, will fail if user has insufficient balance in the input token.",
  schema: z.object({
    amount: z.string().describe("The amount to swap, e.g. 1.2345"),
    fromToken: z
      .string()
      .describe("The asset address to swap from. (must be a token)"),
    toToken: z
      .string()
      .describe("The asset address to swap to. (must be a token)"),
    slippage: z
      .number()
      .optional()
      .describe("Slippage tolerance (default: 0.01 for 1%)"),
  }),
};

type SwapParams = z.infer<typeof SwapExactInputToolDefinition.schema>;

export interface SwapResult extends TxResult {}

export const swapExactInput: WalletToolFn<SwapParams, SwapResult> = async (
  wallet,
  params
) => {
  const network = wallet.getNetworkInfo();
  if (!network.elektrik)
    throw new Error("Elektrik DEX not setup for this network");
  if (!network.permit2) throw new Error("Permit2 not setup for this network");
  const provider = makeNetworkProvider(network);
  const senderAddress = await wallet.getAddress();

  // parse the amount
  const tokenIn = new Contract(params.fromToken, ERC20ABI, provider);
  const decimals = await tokenIn.decimals!();
  const amountIn = parseUnits(params.amount, decimals);

  // ensure enough balance
  const balance = await tokenIn.balanceOf!(senderAddress);
  if (balance < amountIn) {
    throw new Error(
      `Insufficient balance in input token ${params.fromToken} for amount ${params.amount}`
    );
  }

  const tx = await swapExactIn(
    provider,
    wallet,
    network.permit2,
    network.elektrik.factoryAddress,
    network.elektrik.routerAddress,
    amountIn,
    params.fromToken,
    params.toToken,
    params.slippage || 0.01
  );

  return {
    status: "success",
    txHash: tx.hash,
  };
};
