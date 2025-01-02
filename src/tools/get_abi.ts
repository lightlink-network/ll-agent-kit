import { z } from "zod";
import type { WalletToolFn } from "./tool.js";
import { isAddress } from "ethers";

export const GetAbiToolDefinition = {
  name: "get_abi",
  description: "Retrieve the ABI of a contract",
  schema: z.object({
    address: z.string().describe("The address of the contract"),
  }),
};

export type GetAbiToolParams = z.infer<typeof GetAbiToolDefinition.schema>;

interface GetAbiResult {
  status: "success" | "failed";
  error?: string;
  name?: string;
  abi: string;
}

export const getAbi: WalletToolFn<GetAbiToolParams, GetAbiResult> = async (
  privateKey,
  network,
  params
) => {
  if (!isAddress(params.address)) {
    return {
      status: "failed",
      error: "Invalid address",
      abi: "[]",
    };
  }

  const url = `${network.explorerUrl}/api/v2/smart-contracts/${params.address}`;

  const response = await fetch(url);
  const data = (await response.json()) as any;

  if (data.abi == undefined || data.abi == "" || data.abi == "[]") {
    return {
      status: "failed",
      error: "No ABI found",
      abi: "[]",
    };
  }

  return {
    status: "success",
    abi: data.abi,
    name: data.name,
  };
};
