import { Contract, namehash, type JsonRpcProvider } from "ethers";
import { makeNetworkProvider, NETWORKS } from "../network.js";
import {
  normalize,
  tldNamehash,
  validateName,
} from "@web3-name-sdk/core/utils";
import { createWeb3Name } from "@web3-name-sdk/core";

export const resolveEnsName = async (name: string) => {
  const tld = name.split(".").pop();

  const normalizedDomain = normalize(name);
  let address: string | null = null;

  switch (tld) {
    case LL_TLD_INFO.tld:
      validateName(normalize(tld));
      address = await resolveLLDomain(normalizedDomain);
      break;
    default:
      const web3Name = createWeb3Name();
      address = await web3Name.getAddress(name);
  }

  if (!address || address === "0x0000000000000000000000000000000000000000") {
    return null;
  }

  return address as string;
};

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

const resolveLLDomain = async (normalizedDomain: string) => {
  const provider = makeNetworkProvider(NETWORKS.PhoenixMainnet);
  const ensAddress = NETWORKS.PhoenixMainnet.ens!.address;
  const nameHash = tldNamehash(normalizedDomain, LL_TLD_INFO.identifier);

  // get the resolver
  const ensRegistry = new Contract(ensAddress, ENSRegistryABI, provider);
  const resolver = await ensRegistry.resolver!(nameHash);

  // get the address
  const resolverContract = new Contract(resolver, ResolverABI, provider);
  const address = await resolverContract.addr!(nameHash);

  return address as string;
};
