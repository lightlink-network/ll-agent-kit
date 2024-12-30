import { z } from "zod";
import { makeNetworkProvider } from "../network.js";
import type { WalletToolFn } from "./tool.js";
import { Contract, parseEther, parseUnits, Wallet } from "ethers";
import { ERC20ABI } from "../abis/erc20.js";

const TransferParamsSchema = z.object({
  to: z.string().describe("The wallet address to transfer to"),
  amount: z.number().describe("The amount to transfer e.g 5.4321"),
  token: z
    .string()
    .optional()
    .describe(
      "The token contract address. If omitted, transfers native currency (e.g. ETH)"
    ),
});

export type TransferParams = z.infer<typeof TransferParamsSchema>;

export const TransferToolDefinition = {
  name: "transfer",
  description: "Transfer any token or native currency to a wallet",
  schema: TransferParamsSchema,
};

export const transfer: WalletToolFn<TransferParams> = async (
  privateKey,
  network,
  params
) => {
  const provider = makeNetworkProvider(network);
  const wallet = new Wallet(privateKey, provider);

  if (!params.token) {
    console.log("[transfer]: transferring native currency");
    const tx = await wallet.sendTransaction({
      to: params.to,
      value: parseEther(params.amount.toString()),
    });

    // wait for the transaction to be mined
    await tx.wait();

    // return the transaction hash
    return JSON.stringify({
      status: "success",
      txHash: tx.hash,
    });
  }

  // get the token contract
  console.log("[transfer]: transferring token");
  const token = new Contract(params.token, ERC20ABI, provider);
  if (!token.transfer || !token.decimals) {
    throw new Error("Internal error: Incorrect ERC20 ABI");
  }

  const tx = await token.transfer(
    params.to,
    parseUnits(params.amount.toString(), await token.decimals())
  );

  // wait for the transaction to be mined
  await tx.wait();

  // return the transaction hash
  return JSON.stringify({
    status: "success",
    txHash: tx.hash,
  });
};
