import { z } from "zod";
import type { WalletToolFn } from "./tool.js";
import { Contract } from "ethers";
import type { Result } from "ethers";
import { makeNetworkProvider } from "../network.js";

export const CallContractToolDefinition = {
  name: "call_contract",
  description: "Call any contract using the abi, method name and parameters",
  schema: z.object({
    chainId: z.number().describe("The chainId to call the contract on"),
    target: z.string().describe("The target of the contract call"),
    abi: z.string().describe("The abi of the contract, as a json array"),
    method: z.string().describe("The method name to call"),
    params: z
      .array(z.string())
      .describe("The parameters to pass to the method"),
  }),
};

export type CallContractParams = z.infer<
  typeof CallContractToolDefinition.schema
>;

export type CallContractResult = {
  status: "success" | "failed";
  error?: string;
  result: any;
};

export const callContract: WalletToolFn<
  CallContractParams,
  CallContractResult
> = async (wallet, networks, params) => {
  const network = networks.findNetwork(params.chainId);
  if (!network)
    throw new Error(`Network with chainId ${params.chainId} not found`);

  const provider = makeNetworkProvider(network);

  console.log(
    "[tool:call_contract]: calling contract",
    params.target,
    params.method,
    params.params
  );
  const contract = new Contract(params.target, params.abi, provider);

  const method = contract.getFunction(params.method);
  if (!method) {
    return {
      status: "failed",
      error: "Method not found",
      result: "",
    };
  }

  const result: Result = await method(...params.params);

  return {
    status: "success",
    result,
  };
};
