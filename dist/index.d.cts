import { z } from 'zod';
import * as _langchain_core_utils_types from '@langchain/core/utils/types';
import { ChainValues } from '@langchain/core/utils/types';
import { StructuredToolInterface } from '@langchain/core/tools';
import { ToolDefinition } from '@langchain/core/language_models/base';
import { Networkish, Transaction, TransactionRequest, TransactionResponse } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { IterableReadableStream } from '@langchain/core/utils/stream';
import { ChatMessageHistory } from 'langchain/memory';
import { BaseMessage } from '@langchain/core/messages';
import { AgentExecutor } from 'langchain/agents';
import { StreamEvent } from '@langchain/core/tracers/log_stream';

interface Network {
    name: string;
    chainId: number;
    rpcUrl: string;
    explorerUrl: string;
    weth: string;
    permit2?: string;
    elektrik?: {
        factoryAddress: string;
        routerAddress: string;
    };
    ens?: {
        address: string;
    };
}
declare const makeNetworkProvider: (network: Network, networkInfo?: Networkish) => JsonRpcProvider;
declare const NETWORKS: {
    PhoenixMainnet: Network;
    PegasusTestnet: Network;
};
declare class NetworkManager {
    private networks;
    constructor(networks: Network[]);
    findNetwork(nameOrId: string | number): Network | undefined;
    getNetworks(): Network[];
}

interface WalletProvider {
    signTransaction: (network: Network, tx: Transaction) => Promise<string>;
    sendTransaction: (network: Network, tx: TransactionRequest) => Promise<TransactionResponse>;
    getAddress: () => Promise<string>;
}

type TxResult = {
    status: "success" | "failed";
    txHash: string;
};

declare const CallContractToolDefinition: {
    name: string;
    description: string;
    schema: z.ZodObject<{
        chainId: z.ZodNumber;
        target: z.ZodString;
        abi: z.ZodString;
        method: z.ZodString;
        params: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        chainId: number;
        params: string[];
        target: string;
        abi: string;
        method: string;
    }, {
        chainId: number;
        params: string[];
        target: string;
        abi: string;
        method: string;
    }>;
};
type CallContractParams = z.infer<typeof CallContractToolDefinition.schema>;
type CallContractResult = {
    status: "success" | "failed";
    error?: string;
    result: any;
};

declare const models: string[];
interface AgentOptions {
    model: (typeof models)[number];
    openAiApiKey?: string;
    anthropicApiKey?: string;
    tools?: ToolDefinition[] | StructuredToolInterface[];
    useDefaultTools?: boolean;
    defaultNetwork?: number;
}

declare const TransferParamsSchema: z.ZodObject<{
    chainId: z.ZodNumber;
    to: z.ZodString;
    amount: z.ZodNumber;
    token: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    chainId: number;
    to: string;
    amount: number;
    token?: string | undefined;
}, {
    chainId: number;
    to: string;
    amount: number;
    token?: string | undefined;
}>;
type TransferParams = z.infer<typeof TransferParamsSchema>;

declare const BalanceParamsSchema: z.ZodObject<{
    chainId: z.ZodNumber;
    address: z.ZodString;
    token: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    address: string;
    chainId: number;
    token?: string | undefined;
}, {
    address: string;
    chainId: number;
    token?: string | undefined;
}>;
type GetBalanceParams = z.infer<typeof BalanceParamsSchema>;
type GetBalanceResult = {
    status: "success" | "failed";
    balance: string;
    symbol: string;
};

declare const SendTxParamsSchema: z.ZodObject<{
    chainId: z.ZodNumber;
    to: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodString>;
    calldata: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    chainId: number;
    to?: string | undefined;
    amount?: string | undefined;
    calldata?: string | undefined;
}, {
    chainId: number;
    to?: string | undefined;
    amount?: string | undefined;
    calldata?: string | undefined;
}>;
type SendTxParams = z.infer<typeof SendTxParamsSchema>;

declare class LLChatSession {
    private agent;
    private chain;
    private history;
    constructor(agent: AgentExecutor, history?: ChatMessageHistory);
    /**
     * Send a message to the agent and return the response
     * The message and the response are added to the history
     * @param message - The message to send to the agent
     * @returns The response from the agent
     */
    say(message: string): Promise<string>;
    /**
     * Execute the agent with a list of messages
     * The messages are added to the history
     * @param messages - The list of messages to execute the agent with
     * @returns The result of the agent execution
     */
    execute(...messages: BaseMessage[]): Promise<ChainValues>;
    stream(...messages: BaseMessage[]): Promise<IterableReadableStream<StreamEvent>>;
    getHistory(): ChatMessageHistory;
    /**
     * Get the history of the chat session
     * @returns The history of the chat session
     */
    getMessages(): Promise<BaseMessage[]>;
    /**
     * Reset the history of the chat session
     */
    resetHistory(): Promise<void>;
}

interface LLAgentConfig extends AgentOptions {
    address: string;
    walletProvider: WalletProvider;
    networks: Network[];
}
declare class LLAgent {
    private agent;
    private walletProvider;
    private networkManager;
    private opts;
    constructor(cfg: LLAgentConfig);
    static fromPrivateKey(privateKey: string, networks: Network[], opts: AgentOptions): Promise<LLAgent>;
    /**
     * Execute the agent with a given input.
     * @returns An object containing the agent's response.
     */
    execute(input: string): Promise<_langchain_core_utils_types.ChainValues>;
    /**
     * Stream the agent's response to a given input.
     * @param input - The input to stream.
     * @returns A stream of agent responses.
     */
    stream(input: string): Promise<IterableReadableStream<AgentStreamChunk>>;
    /**
     * Create a new chat session with the agent.
     * @returns A new chat session with the agent.
     */
    chat(): LLChatSession;
    /**
     * Transfer funds from the agent's wallet to another address.
     * @returns An object containing the transaction hash.
     */
    transfer(params: TransferParams): Promise<TxResult>;
    /**
     * Get the balance of the agent's wallet.
     * @returns An object containing the balance of the wallet.
     */
    getBalance(params: GetBalanceParams): Promise<GetBalanceResult>;
    /**
     * Send a transaction from the agent's wallet.
     * @returns An object containing the transaction hash.
     */
    sendTransaction(params: SendTxParams): Promise<TxResult>;
    /**
     * Call a contract function.
     * @returns An object containing the result of the contract call.
     */
    callContract(params: CallContractParams): Promise<CallContractResult>;
}
interface AgentStreamChunk {
    intermediateSteps?: AgentStreamChunkStep[];
    output?: string;
}
interface AgentStreamChunkStep {
    action: {
        tool?: string;
        toolInput?: Record<string, any>;
        toolCallId?: string;
        log: string;
        messageLog: any[];
    };
    observation: string;
}

export { type AgentStreamChunk, type AgentStreamChunkStep, LLAgent, type LLAgentConfig, LLChatSession, NETWORKS, type Network, NetworkManager, makeNetworkProvider };
