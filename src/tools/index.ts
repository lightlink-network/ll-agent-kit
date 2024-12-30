import { tool } from "@langchain/core/tools";
import { withWallet } from "./tool.js";
import { sendTx, SendTxToolDefinition } from "./send_tx.js";
import { getBalance, GetBalanceToolDefinition } from "./get_balance.js";
import { transfer, TransferToolDefinition } from "./transfer.js";
import { callContract, CallContractToolDefinition } from "./call_contract.js";
import type { WalletProvider } from "../wallet.js";

// Creates all tools for the agent
export const createTools = (agent: WalletProvider) => [
  tool(asJson(withWallet(agent, sendTx)), SendTxToolDefinition),
  tool(asJson(withWallet(agent, callContract)), CallContractToolDefinition),
  tool(asJson(withWallet(agent, getBalance)), GetBalanceToolDefinition),
  tool(asJson(withWallet(agent, transfer)), TransferToolDefinition),
];

export const asJson = <T, R>(fn: (params: T) => Promise<R>) => {
  return async (params: T) => JSON.stringify(await fn(params));
};
