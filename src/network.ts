import type { Networkish } from "ethers";
import { EnsPlugin } from "ethers";
import { JsonRpcProvider } from "ethers/providers";

export interface Network {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  weth: string;
  permit2?: string;
  elektrik?: {
    factoryAddress: string;
    routerAddress: string;
  };
  ens?: {
    address: string;
  };
}

export const makeNetworkProvider = (
  network: Network,
  networkInfo?: Networkish
) => {
  return new JsonRpcProvider(network.rpcUrl, networkInfo);
};

export const NETWORKS = {
  PhoenixMainnet: {
    name: "LightLink (Phoenix Mainnet)",
    chainId: 1890,
    rpcUrl: "https://replicator.phoenix.lightlink.io/rpc/v1",
    explorerUrl: "https://phoenix.lightlink.io",
    weth: "0x7EbeF2A4b1B09381Ec5B9dF8C5c6f2dBECA59c73",
    permit2: "0x65b0dE86Df48d72aCdaF7E548b5C836663A0a4fa",
    elektrik: {
      factoryAddress: "0xEE6099234bbdC793a43676D98Eb6B589ca7112D7",
      routerAddress: "0x6B3ea22C757BbF9C78CcAaa2eD9562b57001720B",
    },
    ens: {
      address: "0x5dC881dDA4e4a8d312be3544AD13118D1a04Cb17",
    },
  } as Network,

  PegasusTestnet: {
    name: "LightLink (Pegasus Testnet)",
    chainId: 1891,
    rpcUrl: "https://replicator.pegasus.lightlink.io/rpc/v1",
    explorerUrl: "https://pegasus.lightlink.io",
    weth: "0xF42991f02C07AB66cFEa282E7E482382aEB85461",
    permit2: "0x65b0dE86Df48d72aCdaF7E548b5C836663A0a4fa",
    elektrik: {
      factoryAddress: "0x7A5531FC6628e55f22ED2C6AD015B75948fC36F4",
      routerAddress: "0x742d315e929B188e3F05FbC49774474a627b0502",
    },
  } as Network,
};

export class NetworkManager {
  private networks: Network[] = [];

  constructor(networks: Network[]) {
    this.networks = networks;
  }

  findNetwork(nameOrId: string | number) {
    return this.networks.find(
      (n) => n.name === nameOrId || n.chainId === nameOrId
    );
  }

  getNetworks() {
    return [...this.networks];
  }
}
