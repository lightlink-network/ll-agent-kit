import { tool } from "@langchain/core/tools";
import { withWallet } from "./tool.js";
import { sendTx, SendTxToolDefinition } from "./send_tx.js";
import { getBalance, GetBalanceToolDefinition } from "./get_balance.js";
import { transfer, TransferToolDefinition } from "./transfer.js";
import { callContract, CallContractToolDefinition } from "./call_contract.js";
import type { WalletProvider } from "../wallet.js";
import { Calculator } from "@langchain/community/tools/calculator";
import {
  explorerSearch,
  ExplorerSearchToolDefinition,
} from "./explorer_search.js";
import { networkStats, NetworkStatsToolDefinition } from "./network_stats.js";
import { getAbi, GetAbiToolDefinition } from "./get_abi.js";
import {
  swapExactInput,
  SwapExactInputToolDefinition,
} from "./swap_exact_input.js";

// Creates all tools for the agent
export const createTools = (agent: WalletProvider) => [
  new Calculator(),
  tool(json(err(withWallet(agent, sendTx))), SendTxToolDefinition),
  tool(json(err(withWallet(agent, callContract))), CallContractToolDefinition),
  tool(json(err(withWallet(agent, getBalance))), GetBalanceToolDefinition),
  tool(json(err(withWallet(agent, transfer))), TransferToolDefinition),
  tool(
    json(err(withWallet(agent, explorerSearch))),
    ExplorerSearchToolDefinition
  ),
  tool(json(err(withWallet(agent, networkStats))), NetworkStatsToolDefinition),
  tool(json(err(withWallet(agent, getAbi))), GetAbiToolDefinition),
  tool(
    json(err(withWallet(agent, swapExactInput))),
    SwapExactInputToolDefinition
  ),
];

export const json = <T, R>(fn: (params: T) => Promise<R>) => {
  return async (params: T) =>
    JSON.stringify(await fn(params), (k, v) => {
      // handle bigint values
      if (v instanceof BigInt) {
        return v.toString();
      }
      return v;
    });
};

export const err = (fn: (...args: any[]) => Promise<any>) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (e) {
      console.error("error", e);
      if (
        e instanceof Error ||
        (typeof e === "object" && e !== null && "message" in e)
      ) {
        return { error: e.message };
      }
      if (typeof e === "string") {
        return { error: e };
      }
      if (typeof e === "object" && e !== null) {
        return { error: JSON.stringify(e) };
      }
      return { error: "Unknown error" };
    }
  };
};
