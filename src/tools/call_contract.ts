import { z } from "zod";
import { makeNetworkProvider } from "../network.js";
import type { WalletToolFn } from "./tool.js";
import { Wallet } from "ethers";

export const CallContractParamsSchema = z.object({
  target: z.string().describe("The target of the contract call"),
  calldata: z
    .string()
    .describe(
      "The calldata to send as hex, typically The hash of the method signature and encoded parameters."
    ),
});

export type CallContractParams = z.infer<typeof CallContractParamsSchema>;

export const CallContractToolDefinition = {
  name: "call_contract",
  description: "Call any contract with raw calldata",
  schema: CallContractParamsSchema,
};

export type CallContractResult = {
  status: "success" | "failed";
  result: any;
};

export const callContract: WalletToolFn<
  CallContractParams,
  CallContractResult
> = async (privateKey, network, params) => {
  const provider = makeNetworkProvider(network);
  const wallet = new Wallet(privateKey, provider);

  const result = await wallet.call({
    to: params.target,
    data: params.calldata,
  });

  return {
    status: "success",
    result,
  };
};
