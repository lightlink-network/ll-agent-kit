import { tool } from "@langchain/core/tools";
import { withWallet, type WalletToolFn } from "./tool.js";
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
import {
  resolveENSDomain,
  ResolveENSDomainToolDefinition,
} from "./resolve_ens_domain.js";
import type { NetworkManager } from "../network.js";
import type { ToolDefinition } from "@langchain/core/language_models/base";

// Creates all tools for the agent
export const createTools = (
  wallet: WalletProvider,
  networks: NetworkManager
) => [
  new Calculator(),
  wrapTool(wallet, networks, sendTx, SendTxToolDefinition),
  wrapTool(wallet, networks, callContract, CallContractToolDefinition),
  wrapTool(wallet, networks, getBalance, GetBalanceToolDefinition),
  wrapTool(wallet, networks, transfer, TransferToolDefinition),
  wrapTool(wallet, networks, explorerSearch, ExplorerSearchToolDefinition),
  wrapTool(wallet, networks, networkStats, NetworkStatsToolDefinition),
  wrapTool(wallet, networks, getAbi, GetAbiToolDefinition),
  wrapTool(wallet, networks, swapExactInput, SwapExactInputToolDefinition),
  wrapTool(wallet, networks, resolveENSDomain, ResolveENSDomainToolDefinition),
];

// Wraps a tool, giving it access to the wallet, network,
// serializes the result to JSON, and wraps it in an error handler
// so that the agent can always read the result.
export const wrapTool = <T, R>(
  wallet: WalletProvider,
  networks: NetworkManager,
  fn: WalletToolFn<T, R>,
  definition: any
) => {
  return tool(json(err(withWallet(wallet, networks, fn))), definition);
};

// Wraps a tool function in a JSON serializer, so that the result can be
// read by the agent. (Also handles bigint values)
const json = <T, R>(fn: (params: T) => Promise<R>) => {
  return async (params: T) =>
    JSON.stringify(await fn(params), (k, v) => {
      // handle bigint values
      if (v instanceof BigInt) {
        return v.toString();
      }
      return v;
    });
};

// Wraps a tool function in an error handler, which format the error
// as text for the agent to read.
const err = (fn: (...args: any[]) => Promise<any>) => {
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
