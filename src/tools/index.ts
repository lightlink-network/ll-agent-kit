import { tool } from "@langchain/core/tools";
import { withWallet, type AgentWithWallet } from "./tool.js";
import { sendTx, SendTxToolDefinition } from "./send_tx.js";
import { getBalance, GetBalanceToolDefinition } from "./get_balance.js";
import { transfer, TransferToolDefinition } from "./transfer.js";
import { callContract, CallContractToolDefinition } from "./call_contract.js";

// Creates all tools for the agent
export const createTools = (agent: AgentWithWallet) => [
  tool(withWallet(agent, sendTx), SendTxToolDefinition),
  tool(withWallet(agent, callContract), CallContractToolDefinition),
  tool(withWallet(agent, getBalance), GetBalanceToolDefinition),
  tool(withWallet(agent, transfer), TransferToolDefinition),
];
