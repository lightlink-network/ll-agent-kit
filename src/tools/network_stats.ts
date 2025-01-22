import { Wallet } from "ethers";
import { z } from "zod";
import { makeNetworkProvider } from "../network.js";
import type { WalletToolFn } from "./tool.js";

export const NetworkStatsToolDefinition = {
  name: "network_stats",
  description:
    "Get stats about the network including: total blocks, txns, avg blocktime, utilization and gas prices etc.",
  schema: z.object({
    chainId: z.number().describe("The chainId to get stats for"),
  }),
};

export type NetworkStatsParams = z.infer<
  typeof NetworkStatsToolDefinition.schema
>;

export type NetworkStatsResult = {
  status: "success" | "failed";
  data: {
    [key: string]: any;
  };
};

export const networkStats: WalletToolFn<
  NetworkStatsParams,
  NetworkStatsResult
> = async (wallet, networks, params) => {
  const network = networks.findNetwork(params.chainId);
  if (!network) {
    throw new Error(`Network with chainId ${params.chainId} not found`);
  }

  const url = `${network.explorerUrl}/api/v2/stats`;
  const response = await fetch(url);
  const data = (await response.json()) as any;

  return { status: "success", data };
};
