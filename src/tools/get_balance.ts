import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { makeNetworkProvider, type Network } from "../network.js";
import type { WalletToolFn } from "./tool.js";
import { Contract, formatEther, formatUnits, isAddress } from "ethers";
import { ERC20ABI } from "../abis/erc20.js";

const BalanceParamsSchema = z.object({
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

export const GetBalanceToolDefinition = {
  name: "get_balance",
  description:
    "Retrieve the token balance or native currency balance for a wallet address",
  schema: BalanceParamsSchema,
};

export const getBalance: WalletToolFn<
  z.infer<typeof BalanceParamsSchema>
> = async (privateKey, network, params) => {
  const provider = makeNetworkProvider(network);

  if (!params.token) {
    console.log("[getBalance]: getting native currency balance");
    const balance = await provider.getBalance(params.address);
    return JSON.stringify({
      status: "success",
      balance: formatEther(balance),
      symbol: "ETH",
    });
  }

  if (!isAddress(params.token)) {
    throw new Error("Invalid token address");
  }

  console.log("[getBalance]: getting token balance");
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

  return JSON.stringify({
    status: "success",
    balance: formatUnits(balance, decimals),
    symbol,
  });
};
