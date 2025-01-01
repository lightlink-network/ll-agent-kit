import type { ChatMessageHistory } from "langchain/memory";
import type { LLAgent } from "./llagent.js";
import {
  BaseMessage,
  ChatMessage,
  HumanMessage,
} from "@langchain/core/messages";
import type { AgentExecutor } from "langchain/agents";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

export class LLChatSession {
  private agent: AgentExecutor;
  private history: ChatMessageHistory;

  constructor(agent: AgentExecutor, history?: ChatMessageHistory) {
    this.agent = agent;
    this.history = history ?? new InMemoryChatMessageHistory();
  }

  async say(message: string) {
    await this.execute(new HumanMessage(message));
  }

  async execute(...messages: BaseMessage[]) {
    for (const message of messages) {
      await this.history.addMessage(message);
    }

    const result = await this.agent.invoke({ messages: this.history });
    await this.history.addAIMessage(result.output);
    return result.output;
  }

  getHistory() {
    return this.history;
  }

  async getMessages() {
    return await this.history.getMessages();
  }

  async resetHistory() {
    await this.history.clear();
  }
}
