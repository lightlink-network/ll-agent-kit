import type { AgentExecutor } from "langchain/agents";
import { createAgent, type AgentOptions } from "./agent.js";
import type { WalletProvider } from "./wallet.js";
import type { Network } from "./network.js";
import type { z } from "zod";
import { transfer, type TransferParams } from "./tools/transfer.js";
import { getBalance, type GetBalanceParams } from "./tools/get_balance.js";
import { sendTx, type SendTxParams } from "./tools/send_tx.js";
import {
  callContract,
  type CallContractParams,
} from "./tools/call_contract.js";
import type { IterableReadableStream } from "@langchain/core/utils/stream";

export interface LLAgentConfig extends AgentOptions {
  privateKey: string;
  network: Network;
}

export class LLAgent {
  private agent: AgentExecutor;
  private walletProvider: WalletProvider;
  private opts: AgentOptions;

  constructor(cfg: LLAgentConfig) {
    this.walletProvider = {
      getPrivateKey: () => cfg.privateKey,
      getNetwork: () => cfg.network,
    };

    this.opts = cfg;
    this.agent = createAgent(this.walletProvider, cfg);
  }

  async execute(input: string) {
    console.log("[LLAgent:execute] 💬 '" + input + "'");
    const response = await this.agent.invoke({ input });

    return response;
  }

  async stream(input: string) {
    console.log("[LLAgent:execute] 💬 '" + input + "'");
    return (await this.agent.stream({
      input,
    })) as IterableReadableStream<AgentStreamChunk>;
  }

  async transfer(params: TransferParams) {
    return await transfer(
      this.walletProvider.getPrivateKey(),
      this.walletProvider.getNetwork(),
      params
    );
  }

  async getBalance(params: GetBalanceParams) {
    return await getBalance(
      this.walletProvider.getPrivateKey(),
      this.walletProvider.getNetwork(),
      params
    );
  }

  async sendTransaction(params: SendTxParams) {
    return await sendTx(
      this.walletProvider.getPrivateKey(),
      this.walletProvider.getNetwork(),
      params
    );
  }

  async callContract(params: CallContractParams) {
    return await callContract(
      this.walletProvider.getPrivateKey(),
      this.walletProvider.getNetwork(),
      params
    );
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
