import { z } from "zod";
import { makeNetworkProvider } from "../network.js";
import type { WalletToolFn } from "./tool.js";
import { Contract, Wallet } from "ethers";
import type { Result } from "ethers";

export const CallContractToolDefinition = {
  name: "call_contract",
  description: "Call any contract using the abi, method name and parameters",
  schema: z.object({
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
> = async (walletProvider, params) => {
  const provider = makeNetworkProvider(walletProvider.getNetworkInfo());

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
