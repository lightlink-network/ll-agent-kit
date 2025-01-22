import { tldNamehash } from "@web3-name-sdk/core/utils";
import { Contract } from "ethers";
import { makeNetworkProvider, NETWORKS } from "../network.js";

const ENSRegistryABI = [
  "function resolver(bytes32 node) external view returns (address)",
];

const ResolverABI = [
  "function addr(bytes32 node) external view returns (address)",
];

const LL_TLD_INFO = {
  tld: "ll",
  identifier:
    50980310089186268088337308227696701776159000940410532847939554039755637n,
  chainId: 1890,
  defaultRpcUrl: "https://replicator.phoenix.lightlink.io/rpc/v1",
  registry: "0x5dC881dDA4e4a8d312be3544AD13118D1a04Cb17",
  sann: "0x9af6F1244df403dAe39Eb2D0be1C3fD0B38e0789",
};

export const resolveLLDomain = async (normalizedDomain: string) => {
  const provider = makeNetworkProvider(NETWORKS.PhoenixMainnet);
  const ensAddress = NETWORKS.PhoenixMainnet.ens!.address;
  const nameHash = tldNamehash(normalizedDomain, LL_TLD_INFO.identifier);

  // 1. get the resolver
  const ensRegistry = new Contract(ensAddress, ENSRegistryABI, provider);
  const resolverAddress = await ensRegistry.resolver!(nameHash);

  // 2. get the address from the resolver
  const ensResolver = new Contract(resolverAddress, ResolverABI, provider);
  const address = await ensResolver.addr!(nameHash);

  return address as string;
};
