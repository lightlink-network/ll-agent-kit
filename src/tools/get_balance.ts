import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { makeNetworkProvider, type Network } from "../network.js";
import type { WalletToolFn } from "./tool.js";
import { Contract, formatEther, formatUnits, isAddress } from "ethers";
import { ERC20ABI } from "../abis/erc20.js";

const BalanceParamsSchema = z.object({
  chainId: z.number().describe("The chainId to get the balance on"),
  address: z
    .string()
    .describe("The address of the wallet to get the balance of"),
  token: z
    .string()
    .optional()
    .describe(
      "The token contract address. If omitted, returns the native token balance (e.g. ETH)"
    ),
});

export type GetBalanceParams = z.infer<typeof BalanceParamsSchema>;

export const GetBalanceToolDefinition = {
  name: "get_balance",
  description:
    "Retrieve the token balance or native currency balance for a wallet address",
  schema: BalanceParamsSchema,
};

export type GetBalanceResult = {
  status: "success" | "failed";
  balance: string;
  symbol: string;
};

export const getBalance: WalletToolFn<
  GetBalanceParams,
  GetBalanceResult
> = async (wallet, networks, params) => {
  const network = networks.findNetwork(params.chainId);
  if (!network) {
    throw new Error(`Network with chainId ${params.chainId} not found`);
  }

  const provider = makeNetworkProvider(network);

  if (!params.token) {
    console.log("[tool:get_balance]: getting native currency balance");
    const balance = await provider.getBalance(params.address);
    return {
      status: "success",
      balance: formatEther(balance),
      symbol: "ETH",
    };
  }

  if (!isAddress(params.token)) {
    throw new Error("Invalid token address");
  }

  console.log("[tool:get_balance]: getting token balance", params);
  const token = new Contract(params.token, ERC20ABI, provider);
  if (!token.balanceOf || !token.decimals || !token.symbol) {
    throw new Error("Internal error: Incorrect ERC20 ABI");
  }

  // make these calls in parallel
  const [balance, decimals, symbol] = await Promise.all([
    token.balanceOf(params.address),
    token.decimals(),
    token.symbol(),
  ]);

  return {
    status: "success",
    balance: formatUnits(balance, decimals),
    symbol,
  };
};
