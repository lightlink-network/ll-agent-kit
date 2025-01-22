import { z } from "zod";
import type { WalletToolFn } from "./tool.js";
import { makeNetworkProvider } from "../network.js";
import { EnsResolver } from "ethers";

export const ResolveENSDomainToolDefinition = {
  name: "resolve_ens_domain",
  description:
    "Resolve a ENS or LL domain to an address. On lightlink networks, you can use LL domains e.g. vitalik.ll otherwise use ENS domains e.g. vitalik.eth",
  schema: z.object({
    domain: z.string(),
  }),
};

export type ResolveENSDomainParams = z.infer<
  typeof ResolveENSDomainToolDefinition.schema
>;

export type ResolveENSDomainResult = {
  status: "success" | "failed";
  error?: string;
  data: {
    address: string | null;
  };
};

export const resolveENSDomain: WalletToolFn<
  ResolveENSDomainParams,
  ResolveENSDomainResult
> = async (privateKey, network, params) => {
  const provider = makeNetworkProvider(network);
  if (!network.ens) {
    return {
      status: "failed",
      error: "ENS not supported on this network",
      data: {
        address: null,
      },
    };
  }

  const ensResolver = new EnsResolver(
    provider,
    network.ens.resolverAddress,
    params.domain
  );

  const address = await ensResolver.getAddress();

  return {
    status: "success",
    data: {
      address,
    },
  };
};
