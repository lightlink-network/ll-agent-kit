import { Wallet } from "ethers";
import { z } from "zod";
import { makeNetworkProvider } from "../network.js";
import type { WalletToolFn } from "./tool.js";

export const NetworkStatsToolDefinition = {
  name: "network_stats",
  description:
    "Get stats about the network including: total blocks, txns, avg blocktime, utilization and gas prices etc.",
  schema: z.object({}),
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
> = async (privateKey, network, params) => {
  const provider = makeNetworkProvider(network);

  const url = `${network.explorerUrl}/api/v2/stats`;
  const response = await fetch(url);
  const data = (await response.json()) as any;

  return { status: "success", data };
};
