import type { ChatMessageHistory } from "langchain/memory";
import type { LLAgent } from "./llagent.js";
import {
  BaseMessage,
  ChatMessage,
  HumanMessage,
} from "@langchain/core/messages";
import type { AgentExecutor } from "langchain/agents";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import type { ChainValues } from "@langchain/core/utils/types";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

export class LLChatSession {
  private agent: AgentExecutor;
  private chain: ChainValues;
  private history: ChatMessageHistory;

  constructor(agent: AgentExecutor, history?: ChatMessageHistory) {
    this.agent = agent;
    this.history = history ?? new InMemoryChatMessageHistory();
    this.chain = new RunnableWithMessageHistory({
      runnable: this.agent,
      getMessageHistory: (_sessionId: string) => this.history,
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });
  }

  /**
   * Send a message to the agent and return the response
   * The message and the response are added to the history
   * @param message - The message to send to the agent
   * @returns The response from the agent
   */
  async say(message: string) {
    const result = await this.execute(new HumanMessage(message));
    return result.output;
  }

  /**
   * Execute the agent with a list of messages
   * The messages are added to the history
   * @param messages - The list of messages to execute the agent with
   * @returns The result of the agent execution
   */
  async execute(...messages: BaseMessage[]) {
    if (messages.length === 0) throw new Error("No messages provided");

    // add all but the last message to the history
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      if (msg) {
        await this.history.addMessage(msg);
      }
    }

    // get the last message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) throw new Error("No last message provided");

    console.log(
      "[LLChatSession:execute] 💬 '" + lastMessage.content.toString() + "'"
    );
    const result = await this.chain.invoke(
      {
        input: lastMessage,
      },
      { configurable: { sessionId: "unused" } }
    );

    return result as ChainValues;
  }

  getHistory() {
    return this.history;
  }

  /**
   * Get the history of the chat session
   * @returns The history of the chat session
   */
  async getMessages() {
    return await this.history.getMessages();
  }

  /**
   * Reset the history of the chat session
   */
  async resetHistory() {
    await this.history.clear();
  }
}
