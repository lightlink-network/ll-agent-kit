import { z } from "zod";
import type { WalletToolFn } from "./tool.js";
import { makeNetworkProvider } from "../network.js";

export const CallContractRawParamsSchema = z.object({
  target: z.string().describe("The target of the contract call"),
  calldata: z
    .string()
    .describe(
      "The calldata to send as hex, typically The hash of the method signature and encoded parameters."
    ),
  chainId: z.number().describe("The chainId to call the contract on"),
});

export type CallContractRawParams = z.infer<typeof CallContractRawParamsSchema>;

export const CallContractToolDefinition = {
  name: "call_contract_raw",
  description: "Call any contract with raw calldata",
  schema: CallContractRawParamsSchema,
};

export type CallContractResult = {
  status: "success" | "failed";
  result: any;
};

export const callContractRaw: WalletToolFn<
  CallContractRawParams,
  CallContractResult
> = async (wallet, networks, params) => {
  const network = networks.findNetwork(params.chainId);
  if (!network)
    throw new Error(`Network with chainId ${params.chainId} not found`);

  const provider = makeNetworkProvider(network);

  console.log("[tool:call_contract_raw]: calling contract", params);
  const result = await provider.call({
    to: params.target,
    data: params.calldata,
  });

  return {
    status: "success",
    result,
  };
};
