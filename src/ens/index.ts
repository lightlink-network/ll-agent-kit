import { Contract, namehash, type JsonRpcProvider } from "ethers";
import { makeNetworkProvider, NETWORKS } from "../network.js";
import {
  normalize,
  tldNamehash,
  validateName,
} from "@web3-name-sdk/core/utils";
import { createWeb3Name } from "@web3-name-sdk/core";
import { resolveLLDomain } from "./lldomain.js";

export const resolveEnsName = async (name: string) => {
  // extract the tld and normalize the domain
  const tld = name.split(".").pop();
  const normalizedDomain = normalize(name);

  // if its a .ll domain, use the custom resolver
  if (tld === "ll") {
    return resolveLLDomain(normalizedDomain);
  }

  // otherwise just use web3-name-sdk to get the address
  const web3Name = createWeb3Name();
  const address = await web3Name.getAddress(name);
  return address as string;
};
