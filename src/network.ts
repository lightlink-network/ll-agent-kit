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
