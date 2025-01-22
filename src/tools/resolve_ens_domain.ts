import { z } from "zod";
import type { WalletToolFn } from "./tool.js";
import { makeNetworkProvider, NETWORKS, type Network } from "../network.js";
import { Contract, EnsPlugin, EnsResolver, namehash } from "ethers";
import { createWeb3Name } from "@web3-name-sdk/core";
import { resolveEnsName } from "../ens/index.js";

export const ResolveENSDomainToolDefinition = {
  name: "resolve_ens_domain",
  description:
    "Resolve any web3 name including ENS, LL domains to an address. e.g. vitalik.ll, vitalik.eth, vitalik.arb",
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
  data?: {
    address: string | null;
  };
};

export const resolveENSDomain: WalletToolFn<
  ResolveENSDomainParams,
  ResolveENSDomainResult
> = async (privateKey, network, params) => {
  console.log(`[resolve_ens_domain] Resolving '${params.domain}'`);

  const address = await resolveEnsName(params.domain);
  if (!address) {
    return {
      status: "failed",
      error: "ENS domain not found",
    };
  }

  return { status: "success", data: { address } };
};
