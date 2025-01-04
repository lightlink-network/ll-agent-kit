import { SystemMessage } from "@langchain/core/messages";
import type { Network } from "./network.js";
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

const createSystemMessage = (network: Network, address: string) =>
  new SystemMessage(
    `You are an AI agent on ${network.name} network capable of executing all kinds of transactions and interacting with the ${network.name} blockchain.
    ${network.name} is an EVM compatible layer 2 network. You are able to execute transactions on behalf of the user.

    The user's address is ${address}.

    If the transaction was successful, return the response in the following format:
    The transaction was successful. The explorer link is: ${network.explorerUrl}/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
    (The explorer is running blockscout).
  
    If the transaction was unsuccessful, return the response in the following format, followed by an explanation if any known:
    The transaction failed.

    The WETH address for this network is ${network.weth}.
  `
  );

const createPrompt = (network: Network, address: string) =>
  ChatPromptTemplate.fromMessages([
    createSystemMessage(network, address),
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
}

export const createAgent = (
  walletProvider: WalletProvider,
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

  const wallet = new Wallet(walletProvider.getPrivateKey());
  const prompt = createPrompt(walletProvider.getNetwork(), wallet.address);

  // Create tools
  const tools = [
    ...(opts.tools ?? []),
  ] as StructuredToolInterface<ZodObjectAny>[];
  if (useDefaultTools) {
    tools.push(...createTools(walletProvider));
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
