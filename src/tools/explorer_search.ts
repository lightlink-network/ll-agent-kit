import { z } from "zod";
import type { WalletToolFn } from "./tool.js";
import { makeNetworkProvider } from "../network.js";
import { Wallet } from "ethers";

export const ExplorerSearchToolDefinition = {
  name: "explorer_search",
  description:
    "Search the block explorer with a given query, will return multiple matching items e.g. 'USDT', will return an item containing information about the USDT contract",
  schema: z.object({
    query: z.string().describe("The query to search for"),
  }),
};

export type ExplorerSearchParams = z.infer<
  typeof ExplorerSearchToolDefinition.schema
>;

export type ExplorerSearchResult = {
  status: "success" | "failed";
  items: {
    address: string;
    address_url: string;
    type?: string;
    [key: string]: any;
  }[];
};

export const explorerSearch: WalletToolFn<
  ExplorerSearchParams,
  ExplorerSearchResult
> = async (walletProvider, params) => {
  console.log("[tool:explorer_search]: searching for", params.query);
  const url = `${walletProvider.getNetworkInfo().explorerUrl}/api/v2/search?q=${params.query}`;
  const response = await fetch(url);
  const data = (await response.json()) as any;

  // if the response is empty, return an empty array
  if (data.items == undefined) {
    throw new Error("Failed to search the explorer");
  }

  // if the response is too long, return the first 5 items
  if (data.items.length > 5) {
    data.items = data.items.slice(0, 5);
  }

  return {
    status: "success",
    items: data.items,
  };
};
