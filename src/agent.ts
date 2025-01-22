import { SystemMessage } from "@langchain/core/messages";
import { NETWORKS, type Network, type NetworkManager } from "./network.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { WalletProvider } from "./wallet.js";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { createTools } from "./tools/index.js";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { Wallet } from "ethers";
import type { StructuredToolInterface } from "@langchain/core/tools";
import type { z } from "zod";
import type { ToolDefinition } from "@langchain/core/language_models/base";

const createSystemMessage = (
  defaultNetwork: Network,
  networks: Network[],
  address: string
) =>
  new SystemMessage(
    `You are an AI agent designed for the ${defaultNetwork.name} network (an ethereum layer 2 network). 
    - You are capable of executing all kinds of transactions and interacting with multiple blockchains. 
    - You are able to execute transactions on behalf of the user.
    - You can use Markdown to format your responses.

    The user's address is ${address}. 

    If you send transactions on behalf of the user, you should briefly explain all transactions you sent, 
    including each transaction's hash and an explorer link to the transaction.

    If the transaction was unsuccessful, explain why it failed (if known).

    Default to using to ${defaultNetwork.name} (${defaultNetwork.chainId}) unless otherwise specified by the user. 

    You can ONLY use the following networks, NEVER use any other network:
    ${networks
      .map((n) => {
        return (
          `\t - ${n.name} (${n.chainId})\n` +
          `\t\t [ Explorer: ${n.explorerUrl}\n` +
          `\t\t  WETH: ${n.weth}\n` +
          `\t\t  RPC: ${n.rpcUrl}\n` +
          `\t\t  Chain ID: ${n.chainId} ]\n`
        );
      })
      .join("")}
  `
  );

const createPrompt = (
  defaultNetwork: Network,
  networks: Network[],
  address: string
) =>
  ChatPromptTemplate.fromMessages([
    createSystemMessage(defaultNetwork, networks, address),
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

export const models = [
  "gpt-4o",
  "gpt-4o-mini",
  "claude-3-5-sonnet-latest",
  "claude-3-5-haiku-latest",
];

type ZodObjectAny = z.ZodObject<any, any, any, any>;

export interface AgentOptions {
  model: (typeof models)[number];
  openAiApiKey?: string;
  anthropicApiKey?: string;
  tools?: ToolDefinition[] | StructuredToolInterface[];
  useDefaultTools?: boolean;
  defaultNetwork?: number;
}

export const createAgent = (
  address: string,
  walletProvider: WalletProvider,
  networkManager: NetworkManager,
  opts: AgentOptions
) => {
  // check model is valid
  if (!models.includes(opts.model)) {
    throw new Error(`Invalid model: ${opts.model}`);
  }

  const useDefaultTools = opts.useDefaultTools ?? true;

  console.log("[createAgent] Creating agent with model:", opts.model);
  let selectedModel: BaseChatModel | undefined;
  if (opts.model === "gpt-4o" || opts.model === "gpt-4o-mini") {
    if (!opts.openAiApiKey) {
      throw new Error("OpenAI API key is required for GPT models");
    }
    selectedModel = new ChatOpenAI({
      modelName: opts.model,
      apiKey: opts.openAiApiKey,
    });
  } else if (
    opts.model === "claude-3-5-sonnet-latest" ||
    opts.model === "claude-3-5-haiku-latest"
  ) {
    if (!opts.anthropicApiKey) {
      throw new Error("Anthropic API key is required for Claude models");
    }
    selectedModel = new ChatAnthropic({
      modelName: opts.model,
      apiKey: opts.anthropicApiKey,
    });
  }

  if (selectedModel === undefined) {
    throw new Error("Unsupported model");
  }

  // Select default network, if not provided, use PegasusTestnet
  const defaultNetwork = networkManager.findNetwork(
    opts.defaultNetwork || NETWORKS.PegasusTestnet.chainId
  );
  if (!defaultNetwork) {
    throw new Error("Default network not found");
  }

  const prompt = createPrompt(
    defaultNetwork,
    networkManager.getNetworks(),
    address
  );

  // Create tools
  const tools = [
    ...(opts.tools ?? []),
  ] as StructuredToolInterface<ZodObjectAny>[];
  if (useDefaultTools) {
    tools.push(...createTools(walletProvider, networkManager));
  }

  const agent = createToolCallingAgent({
    llm: selectedModel,
    tools,
    prompt,
  });

  return new AgentExecutor({
    agent,
    tools,
    verbose: process.env.VERBOSE === "true",
  });
};
