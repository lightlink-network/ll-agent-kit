import type { AgentExecutor } from "langchain/agents";
import { createAgent, type AgentOptions } from "./agent.js";
import { PrivateKeyWalletProvider, type WalletProvider } from "./wallet.js";
import type { Network } from "./network.js";
import { transfer, type TransferParams } from "./tools/transfer.js";
import {
  getBalance,
  type GetBalanceParams,
  type GetBalanceResult,
} from "./tools/get_balance.js";
import { sendTx, type SendTxParams } from "./tools/send_tx.js";
import {
  callContract,
  type CallContractParams,
} from "./tools/call_contract.js";
import type { IterableReadableStream } from "@langchain/core/utils/stream";
import type { ChatMessage } from "@langchain/core/messages";
import { LLChatSession } from "./llchat.js";
import type { TxResult } from "./tools/tool.js";
import { Wallet } from "ethers";

export interface LLAgentConfig extends AgentOptions {
  address: string;
  walletProvider: WalletProvider;
}

export class LLAgent {
  private agent: AgentExecutor;
  private walletProvider: WalletProvider;
  private opts: AgentOptions;

  constructor(cfg: LLAgentConfig) {
    this.walletProvider = cfg.walletProvider;
    this.opts = cfg;
    this.agent = createAgent(cfg.address, this.walletProvider, cfg);
  }

  static async fromPrivateKey(
    privateKey: string,
    network: Network,
    opts: AgentOptions
  ) {
    const walletProvider = new PrivateKeyWalletProvider(privateKey, network);
    const address = await walletProvider.getAddress();
    return new LLAgent({ ...opts, address, walletProvider });
  }

  /**
   * Execute the agent with a given input.
   * @returns An object containing the agent's response.
   */
  async execute(input: string) {
    console.log("[LLAgent:execute] 💬 '" + input + "'");
    const response = await this.agent.invoke({ input });

    return response;
  }

  /**
   * Stream the agent's response to a given input.
   * @param input - The input to stream.
   * @returns A stream of agent responses.
   */
  async stream(input: string) {
    console.log("[LLAgent:execute] 💬 '" + input + "'");
    return (await this.agent.stream({
      input,
    })) as IterableReadableStream<AgentStreamChunk>;
  }

  /**
   * Create a new chat session with the agent.
   * @returns A new chat session with the agent.
   */
  chat() {
    return new LLChatSession(this.agent);
  }

  /**
   * Transfer funds from the agent's wallet to another address.
   * @returns An object containing the transaction hash.
   */
  async transfer(params: TransferParams) {
    return await transfer(this.walletProvider, params);
  }

  /**
   * Get the balance of the agent's wallet.
   * @returns An object containing the balance of the wallet.
   */
  async getBalance(params: GetBalanceParams) {
    return await getBalance(this.walletProvider, params);
  }

  /**
   * Send a transaction from the agent's wallet.
   * @returns An object containing the transaction hash.
   */
  async sendTransaction(params: SendTxParams) {
    return await sendTx(this.walletProvider, params);
  }

  /**
   * Call a contract function.
   * @returns An object containing the result of the contract call.
   */
  async callContract(params: CallContractParams) {
    return await callContract(this.walletProvider, params);
  }
}

export interface AgentStreamChunk {
  intermediateSteps?: AgentStreamChunkStep[];
  output?: string;
}

export interface AgentStreamChunkStep {
  action: {
    tool?: string;
    toolInput?: Record<string, any>;
    toolCallId?: string;
    log: string;
    messageLog: any[];
  };
  observation: string;
}
