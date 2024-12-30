import { JsonRpcProvider } from "ethers/providers";

export interface Network {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

export const makeNetworkProvider = (network: Network) => {
  return new JsonRpcProvider(network.rpcUrl);
};

export const NETWORKS = {
  PhoenixMainnet: {
    name: "LightLink (Phoenix Mainnet)",
    chainId: 1890,
    rpcUrl: "https://replicator.phoenix.lightlink.io/rpc/v1",
    explorerUrl: "https://phoenix.lightlink.io",
  } as Network,

  PegasusTestnet: {
    name: "LightLink (Pegasus Testnet)",
    chainId: 1891,
    rpcUrl: "https://replicator.pegasus.lightlink.io/rpc/v1",
    explorerUrl: "https://pegasus.lightlink.io",
  } as Network,
};
