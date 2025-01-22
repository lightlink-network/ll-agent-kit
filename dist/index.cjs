"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  LLAgent: () => LLAgent,
  LLChatSession: () => LLChatSession,
  NETWORKS: () => NETWORKS,
  makeNetworkProvider: () => makeNetworkProvider
});
module.exports = __toCommonJS(index_exports);

// src/agent.ts
var import_messages = require("@langchain/core/messages");
var import_prompts = require("@langchain/core/prompts");
var import_openai = require("@langchain/openai");
var import_anthropic = require("@langchain/anthropic");

// src/tools/index.ts
var import_tools2 = require("@langchain/core/tools");

// src/tools/tool.ts
var withWallet = (wallet, fn) => {
  return (params) => fn(wallet, params);
};

// src/tools/send_tx.ts
var import_zod = require("zod");

// src/network.ts
var import_ethers = require("ethers");
var import_providers = require("ethers/providers");
var makeNetworkProvider = (network, networkInfo) => {
  return new import_providers.JsonRpcProvider(network.rpcUrl, networkInfo);
};
var NETWORKS = {
  PhoenixMainnet: {
    name: "LightLink (Phoenix Mainnet)",
    chainId: 1890,
    rpcUrl: "https://replicator.phoenix.lightlink.io/rpc/v1",
    explorerUrl: "https://phoenix.lightlink.io",
    weth: "0x7EbeF2A4b1B09381Ec5B9dF8C5c6f2dBECA59c73",
    permit2: "0x65b0dE86Df48d72aCdaF7E548b5C836663A0a4fa",
    elektrik: {
      factoryAddress: "0xEE6099234bbdC793a43676D98Eb6B589ca7112D7",
      routerAddress: "0x6B3ea22C757BbF9C78CcAaa2eD9562b57001720B"
    },
    ens: {
      address: "0x5dC881dDA4e4a8d312be3544AD13118D1a04Cb17"
    }
  },
  PegasusTestnet: {
    name: "LightLink (Pegasus Testnet)",
    chainId: 1891,
    rpcUrl: "https://replicator.pegasus.lightlink.io/rpc/v1",
    explorerUrl: "https://pegasus.lightlink.io",
    weth: "0xF42991f02C07AB66cFEa282E7E482382aEB85461",
    permit2: "0x65b0dE86Df48d72aCdaF7E548b5C836663A0a4fa",
    elektrik: {
      factoryAddress: "0x7A5531FC6628e55f22ED2C6AD015B75948fC36F4",
      routerAddress: "0x742d315e929B188e3F05FbC49774474a627b0502"
    }
  }
};

// src/tools/send_tx.ts
var import_ethers2 = require("ethers");
var SendTxParamsSchema = import_zod.z.object({
  to: import_zod.z.string().optional().describe("The target of the transaction"),
  amount: import_zod.z.string().optional().describe("The amount to send e.g 5.4321"),
  calldata: import_zod.z.string().optional().describe("The calldata to send as hex")
});
var SendTxToolDefinition = {
  name: "send_transaction",
  description: "Send a raw ethereum transaction",
  schema: SendTxParamsSchema
};
var sendTx = async (walletProvider, params) => {
  console.log("[tool:send_tx]: sending transaction", params);
  const tx = await walletProvider.sendTransaction({
    to: params.to,
    value: params.amount ? (0, import_ethers2.parseEther)(params.amount) : void 0,
    data: params.calldata
  });
  await tx.wait();
  return {
    status: "success",
    txHash: tx.hash
  };
};

// src/tools/get_balance.ts
var import_zod2 = require("zod");
var import_tools = require("@langchain/core/tools");
var import_ethers3 = require("ethers");

// src/abis/erc20.ts
var ERC20ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address"
      },
      {
        name: "_to",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      },
      {
        name: "_spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  }
];

// src/tools/get_balance.ts
var BalanceParamsSchema = import_zod2.z.object({
  address: import_zod2.z.string().describe("The address of the wallet to get the balance of"),
  token: import_zod2.z.string().optional().describe(
    "The token contract address. If omitted, returns the native token balance (e.g. ETH)"
  )
});
var GetBalanceToolDefinition = {
  name: "get_balance",
  description: "Retrieve the token balance or native currency balance for a wallet address",
  schema: BalanceParamsSchema
};
var getBalance = async (walletProvider, params) => {
  const provider = makeNetworkProvider(walletProvider.getNetworkInfo());
  if (!params.token) {
    console.log("[tool:get_balance]: getting native currency balance");
    const balance2 = await provider.getBalance(params.address);
    return {
      status: "success",
      balance: (0, import_ethers3.formatEther)(balance2),
      symbol: "ETH"
    };
  }
  if (!(0, import_ethers3.isAddress)(params.token)) {
    throw new Error("Invalid token address");
  }
  console.log("[tool:get_balance]: getting token balance", params);
  const token = new import_ethers3.Contract(params.token, ERC20ABI, provider);
  if (!token.balanceOf || !token.decimals || !token.symbol) {
    throw new Error("Internal error: Incorrect ERC20 ABI");
  }
  const [balance, decimals, symbol] = await Promise.all([
    token.balanceOf(params.address),
    token.decimals(),
    token.symbol()
  ]);
  return {
    status: "success",
    balance: (0, import_ethers3.formatUnits)(balance, decimals),
    symbol
  };
};

// src/tools/transfer.ts
var import_zod3 = require("zod");
var import_ethers4 = require("ethers");
var TransferParamsSchema = import_zod3.z.object({
  to: import_zod3.z.string().describe("The wallet address to transfer to"),
  amount: import_zod3.z.number().describe("The amount to transfer e.g 5.4321"),
  token: import_zod3.z.string().optional().describe(
    "The token contract address. If omitted, transfers native currency (e.g. ETH)"
  )
});
var TransferToolDefinition = {
  name: "transfer",
  description: "Transfer any token or native currency to a wallet",
  schema: TransferParamsSchema
};
var transfer = async (wallet, params) => {
  const provider = makeNetworkProvider(wallet.getNetworkInfo());
  if (!params.token) {
    console.log("[tool:transfer]: transferring native currency", params);
    const tx2 = await wallet.sendTransaction({
      to: params.to,
      value: (0, import_ethers4.parseEther)(params.amount.toString())
    });
    await tx2.wait();
    return {
      status: "success",
      txHash: tx2.hash
    };
  }
  console.log("[tool:transfer]: transferring token", params);
  const token = new import_ethers4.Contract(params.token, ERC20ABI, provider);
  if (!token.transfer || !token.decimals) {
    throw new Error("Internal error: Incorrect ERC20 ABI");
  }
  const callData = token.interface.encodeFunctionData("transfer", [
    params.to,
    (0, import_ethers4.parseUnits)(params.amount.toString(), await token.decimals())
  ]);
  const tx = await wallet.sendTransaction({
    to: params.token,
    data: callData
  });
  await tx.wait();
  return {
    status: "success",
    txHash: tx.hash
  };
};

// src/tools/call_contract.ts
var import_zod4 = require("zod");
var import_ethers5 = require("ethers");
var CallContractToolDefinition = {
  name: "call_contract",
  description: "Call any contract using the abi, method name and parameters",
  schema: import_zod4.z.object({
    target: import_zod4.z.string().describe("The target of the contract call"),
    abi: import_zod4.z.string().describe("The abi of the contract, as a json array"),
    method: import_zod4.z.string().describe("The method name to call"),
    params: import_zod4.z.array(import_zod4.z.string()).describe("The parameters to pass to the method")
  })
};
var callContract = async (walletProvider, params) => {
  const provider = makeNetworkProvider(walletProvider.getNetworkInfo());
  console.log(
    "[tool:call_contract]: calling contract",
    params.target,
    params.method,
    params.params
  );
  const contract = new import_ethers5.Contract(params.target, params.abi, provider);
  const method = contract.getFunction(params.method);
  if (!method) {
    return {
      status: "failed",
      error: "Method not found",
      result: ""
    };
  }
  const result = await method(...params.params);
  return {
    status: "success",
    result
  };
};

// src/tools/index.ts
var import_calculator = require("@langchain/community/tools/calculator");

// src/tools/explorer_search.ts
var import_zod5 = require("zod");
var import_ethers6 = require("ethers");
var ExplorerSearchToolDefinition = {
  name: "explorer_search",
  description: "Search the block explorer with a given query, will return multiple matching items e.g. 'USDT', will return an item containing information about the USDT contract",
  schema: import_zod5.z.object({
    query: import_zod5.z.string().describe("The query to search for")
  })
};
var explorerSearch = async (walletProvider, params) => {
  console.log("[tool:explorer_search]: searching for", params.query);
  const url = `${walletProvider.getNetworkInfo().explorerUrl}/api/v2/search?q=${params.query}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.items == void 0) {
    throw new Error("Failed to search the explorer");
  }
  if (data.items.length > 5) {
    data.items = data.items.slice(0, 5);
  }
  return {
    status: "success",
    items: data.items
  };
};

// src/tools/network_stats.ts
var import_ethers7 = require("ethers");
var import_zod6 = require("zod");
var NetworkStatsToolDefinition = {
  name: "network_stats",
  description: "Get stats about the network including: total blocks, txns, avg blocktime, utilization and gas prices etc.",
  schema: import_zod6.z.object({})
};
var networkStats = async (walletProvider, params) => {
  const url = `${walletProvider.getNetworkInfo().explorerUrl}/api/v2/stats`;
  const response = await fetch(url);
  const data = await response.json();
  return { status: "success", data };
};

// src/tools/get_abi.ts
var import_zod7 = require("zod");
var import_ethers8 = require("ethers");
var GetAbiToolDefinition = {
  name: "get_abi",
  description: "Retrieve the ABI of a contract",
  schema: import_zod7.z.object({
    address: import_zod7.z.string().describe("The address of the contract")
  })
};
var getAbi = async (walletProvider, params) => {
  if (!(0, import_ethers8.isAddress)(params.address)) {
    return {
      status: "failed",
      error: "Invalid address",
      abi: "[]"
    };
  }
  const url = `${walletProvider.getNetworkInfo().explorerUrl}/api/v2/smart-contracts/${params.address}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.abi == void 0 || data.abi == "" || data.abi == "[]") {
    return {
      status: "failed",
      error: "No ABI found",
      abi: "[]"
    };
  }
  return {
    status: "success",
    abi: data.abi,
    name: data.name
  };
};

// src/tools/swap_exact_input.ts
var import_ethers13 = require("ethers");
var import_zod8 = require("zod");

// src/elektrik/universalRouter.ts
var import_ethers9 = require("ethers");
var import_ethers10 = require("ethers");

// src/abis/elektrikRouter.ts
var universalRouterABI = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "permit2", type: "address" },
          { internalType: "address", name: "weth9", type: "address" },
          { internalType: "address", name: "seaportV1_5", type: "address" },
          { internalType: "address", name: "seaportV1_4", type: "address" },
          { internalType: "address", name: "openseaConduit", type: "address" },
          { internalType: "address", name: "nftxZap", type: "address" },
          { internalType: "address", name: "x2y2", type: "address" },
          { internalType: "address", name: "foundation", type: "address" },
          { internalType: "address", name: "sudoswap", type: "address" },
          { internalType: "address", name: "elementMarket", type: "address" },
          { internalType: "address", name: "nft20Zap", type: "address" },
          { internalType: "address", name: "cryptopunks", type: "address" },
          { internalType: "address", name: "looksRareV2", type: "address" },
          {
            internalType: "address",
            name: "routerRewardsDistributor",
            type: "address"
          },
          {
            internalType: "address",
            name: "looksRareRewardsDistributor",
            type: "address"
          },
          { internalType: "address", name: "looksRareToken", type: "address" },
          { internalType: "address", name: "v2Factory", type: "address" },
          { internalType: "address", name: "v3Factory", type: "address" },
          {
            internalType: "bytes32",
            name: "pairInitCodeHash",
            type: "bytes32"
          },
          {
            internalType: "bytes32",
            name: "poolInitCodeHash",
            type: "bytes32"
          }
        ],
        internalType: "struct RouterParameters",
        name: "params",
        type: "tuple"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { inputs: [], name: "BalanceTooLow", type: "error" },
  { inputs: [], name: "BuyPunkFailed", type: "error" },
  { inputs: [], name: "ContractLocked", type: "error" },
  { inputs: [], name: "ETHNotAccepted", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "commandIndex", type: "uint256" },
      { internalType: "bytes", name: "message", type: "bytes" }
    ],
    name: "ExecutionFailed",
    type: "error"
  },
  { inputs: [], name: "FromAddressIsNotOwner", type: "error" },
  { inputs: [], name: "InsufficientETH", type: "error" },
  { inputs: [], name: "InsufficientToken", type: "error" },
  { inputs: [], name: "InvalidBips", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "commandType", type: "uint256" }],
    name: "InvalidCommandType",
    type: "error"
  },
  { inputs: [], name: "InvalidOwnerERC1155", type: "error" },
  { inputs: [], name: "InvalidOwnerERC721", type: "error" },
  { inputs: [], name: "InvalidPath", type: "error" },
  { inputs: [], name: "InvalidReserves", type: "error" },
  { inputs: [], name: "InvalidSpender", type: "error" },
  { inputs: [], name: "LengthMismatch", type: "error" },
  { inputs: [], name: "SliceOutOfBounds", type: "error" },
  { inputs: [], name: "TransactionDeadlinePassed", type: "error" },
  { inputs: [], name: "UnableToClaim", type: "error" },
  { inputs: [], name: "UnsafeCast", type: "error" },
  { inputs: [], name: "V2InvalidPath", type: "error" },
  { inputs: [], name: "V2TooLittleReceived", type: "error" },
  { inputs: [], name: "V2TooMuchRequested", type: "error" },
  { inputs: [], name: "V3InvalidAmountOut", type: "error" },
  { inputs: [], name: "V3InvalidCaller", type: "error" },
  { inputs: [], name: "V3InvalidSwap", type: "error" },
  { inputs: [], name: "V3TooLittleReceived", type: "error" },
  { inputs: [], name: "V3TooMuchRequested", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "RewardsSent",
    type: "event"
  },
  {
    inputs: [{ internalType: "bytes", name: "looksRareClaim", type: "bytes" }],
    name: "collectRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes", name: "commands", type: "bytes" },
      { internalType: "bytes[]", name: "inputs", type: "bytes[]" }
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes", name: "commands", type: "bytes" },
      { internalType: "bytes[]", name: "inputs", type: "bytes[]" },
      { internalType: "uint256", name: "deadline", type: "uint256" }
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256[]", name: "", type: "uint256[]" },
      { internalType: "uint256[]", name: "", type: "uint256[]" },
      { internalType: "bytes", name: "", type: "bytes" }
    ],
    name: "onERC1155BatchReceived",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bytes", name: "", type: "bytes" }
    ],
    name: "onERC1155Received",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bytes", name: "", type: "bytes" }
    ],
    name: "onERC721Received",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      { internalType: "int256", name: "amount0Delta", type: "int256" },
      { internalType: "int256", name: "amount1Delta", type: "int256" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "uniswapV3SwapCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  { stateMutability: "payable", type: "receive" }
];

// src/elektrik/universalRouter.ts
var UniversalRouter = class {
  universalRouter;
  constructor(routerAddress, provider) {
    this.universalRouter = new import_ethers9.Contract(
      routerAddress,
      universalRouterABI,
      provider
    );
  }
  /**
   * @description Triggers a v3 swap on the universal router.
   * @param wallet - The wallet to use for the swap.
   * @param amountIn - The amount of tokens to swap.
   * @param amountOutMin - The minimum amount of tokens to receive.
   * @param fee - The fee to use for the swap.
   * @param path - The path to use for the swap.
   * @returns The transaction that was sent.
   * @dev It runs the V3_SWAP_EXACT_IN command on the universalRouter.
   * ```
   * V3_SWAP_EXACT_IN = 0x00
   * INPUTS = abi.encode(wallet.address, amountIn, amountOutMin,
   *    abi.encodePacked(path.tokenIn, fee, path.tokenOut), true)
   * universalRouter.execute(V3_SWAP_EXACT_IN, inputs)
   * ```
   */
  async swapExactIn(wallet, amountIn, amountOutMin, path) {
    const SWAP_EXACT_IN = "0x00";
    const senderAddress = await wallet.getAddress();
    const v3SwapRoute = import_ethers10.ethers.solidityPacked(
      ["address", "uint24", "address"],
      [path.tokenIn, path.fee, path.tokenOut]
    );
    const inputs = import_ethers10.AbiCoder.defaultAbiCoder().encode(
      // Encode the inputs for V3_SWAP_EXACT_IN
      ["address", "uint256", "uint256", "bytes", "bool"],
      [senderAddress, amountIn, amountOutMin, v3SwapRoute, true]
    );
    const callData = await this.universalRouter.interface.encodeFunctionData(
      "execute",
      [SWAP_EXACT_IN, [inputs]]
    );
    const tx = await wallet.sendTransaction({
      to: await this.universalRouter.getAddress(),
      data: callData
    });
    await tx.wait();
    return tx;
  }
};
var universalRouter_default = UniversalRouter;

// src/elektrik/pool.ts
var import_ethers11 = require("ethers");
var import_v3_sdk = require("@uniswap/v3-sdk");

// src/abis/elektrikFactory.ts
var IElektrikFactoryABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint24", name: "fee", type: "uint24" },
      {
        indexed: true,
        internalType: "int24",
        name: "tickSpacing",
        type: "int24"
      }
    ],
    name: "FeeAmountEnabled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnerChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token0",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token1",
        type: "address"
      },
      { indexed: true, internalType: "uint24", name: "fee", type: "uint24" },
      {
        indexed: false,
        internalType: "int24",
        name: "tickSpacing",
        type: "int24"
      },
      {
        indexed: false,
        internalType: "address",
        name: "pool",
        type: "address"
      }
    ],
    name: "PoolCreated",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
      { internalType: "uint24", name: "fee", type: "uint24" }
    ],
    name: "createPool",
    outputs: [{ internalType: "address", name: "pool", type: "address" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint24", name: "fee", type: "uint24" },
      { internalType: "int24", name: "tickSpacing", type: "int24" }
    ],
    name: "enableFeeAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint24", name: "", type: "uint24" }],
    name: "feeAmountTickSpacing",
    outputs: [{ internalType: "int24", name: "", type: "int24" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint24", name: "", type: "uint24" }
    ],
    name: "getPool",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "parameters",
    outputs: [
      { internalType: "address", name: "factory", type: "address" },
      { internalType: "address", name: "token0", type: "address" },
      { internalType: "address", name: "token1", type: "address" },
      { internalType: "uint24", name: "fee", type: "uint24" },
      { internalType: "int24", name: "tickSpacing", type: "int24" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_owner", type: "address" }],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// src/utils.ts
var requireMethods = (contract, ...methods) => {
  const funcs = [];
  for (const method of methods) {
    const func = contract.getFunction(method);
    if (!func) {
      throw new Error(
        `Method ${method} not found on contract ${contract.address}`
      );
    }
    funcs.push(func);
  }
  return funcs;
};

// src/abis/eletrikPool.ts
var IElektrikPoolABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickLower",
        type: "int24"
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickUpper",
        type: "int24"
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      }
    ],
    name: "Burn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickLower",
        type: "int24"
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickUpper",
        type: "int24"
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount0",
        type: "uint128"
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount1",
        type: "uint128"
      }
    ],
    name: "Collect",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount0",
        type: "uint128"
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount1",
        type: "uint128"
      }
    ],
    name: "CollectProtocol",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paid0",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paid1",
        type: "uint256"
      }
    ],
    name: "Flash",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "observationCardinalityNextOld",
        type: "uint16"
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "observationCardinalityNextNew",
        type: "uint16"
      }
    ],
    name: "IncreaseObservationCardinalityNext",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint160",
        name: "sqrtPriceX96",
        type: "uint160"
      },
      { indexed: false, internalType: "int24", name: "tick", type: "int24" }
    ],
    name: "Initialize",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickLower",
        type: "int24"
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickUpper",
        type: "int24"
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      }
    ],
    name: "Mint",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "feeProtocol0Old",
        type: "uint8"
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "feeProtocol1Old",
        type: "uint8"
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "feeProtocol0New",
        type: "uint8"
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "feeProtocol1New",
        type: "uint8"
      }
    ],
    name: "SetFeeProtocol",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        indexed: false,
        internalType: "int256",
        name: "amount0",
        type: "int256"
      },
      {
        indexed: false,
        internalType: "int256",
        name: "amount1",
        type: "int256"
      },
      {
        indexed: false,
        internalType: "uint160",
        name: "sqrtPriceX96",
        type: "uint160"
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "liquidity",
        type: "uint128"
      },
      { indexed: false, internalType: "int24", name: "tick", type: "int24" }
    ],
    name: "Swap",
    type: "event"
  },
  {
    inputs: [
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" },
      { internalType: "uint128", name: "amount", type: "uint128" }
    ],
    name: "burn",
    outputs: [
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" },
      { internalType: "uint128", name: "amount0Requested", type: "uint128" },
      { internalType: "uint128", name: "amount1Requested", type: "uint128" }
    ],
    name: "collect",
    outputs: [
      { internalType: "uint128", name: "amount0", type: "uint128" },
      { internalType: "uint128", name: "amount1", type: "uint128" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint128", name: "amount0Requested", type: "uint128" },
      { internalType: "uint128", name: "amount1Requested", type: "uint128" }
    ],
    name: "collectProtocol",
    outputs: [
      { internalType: "uint128", name: "amount0", type: "uint128" },
      { internalType: "uint128", name: "amount1", type: "uint128" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "factory",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "fee",
    outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "feeGrowthGlobal0X128",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "feeGrowthGlobal1X128",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "flash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "observationCardinalityNext",
        type: "uint16"
      }
    ],
    name: "increaseObservationCardinalityNext",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "liquidity",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "maxLiquidityPerTick",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" },
      { internalType: "uint128", name: "amount", type: "uint128" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "mint",
    outputs: [
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "observations",
    outputs: [
      { internalType: "uint32", name: "blockTimestamp", type: "uint32" },
      { internalType: "int56", name: "tickCumulative", type: "int56" },
      {
        internalType: "uint160",
        name: "secondsPerLiquidityCumulativeX128",
        type: "uint160"
      },
      { internalType: "bool", name: "initialized", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint32[]", name: "secondsAgos", type: "uint32[]" }
    ],
    name: "observe",
    outputs: [
      { internalType: "int56[]", name: "tickCumulatives", type: "int56[]" },
      {
        internalType: "uint160[]",
        name: "secondsPerLiquidityCumulativeX128s",
        type: "uint160[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "positions",
    outputs: [
      { internalType: "uint128", name: "liquidity", type: "uint128" },
      {
        internalType: "uint256",
        name: "feeGrowthInside0LastX128",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "feeGrowthInside1LastX128",
        type: "uint256"
      },
      { internalType: "uint128", name: "tokensOwed0", type: "uint128" },
      { internalType: "uint128", name: "tokensOwed1", type: "uint128" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "protocolFees",
    outputs: [
      { internalType: "uint128", name: "token0", type: "uint128" },
      { internalType: "uint128", name: "token1", type: "uint128" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint8", name: "feeProtocol0", type: "uint8" },
      { internalType: "uint8", name: "feeProtocol1", type: "uint8" }
    ],
    name: "setFeeProtocol",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "slot0",
    outputs: [
      { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
      { internalType: "int24", name: "tick", type: "int24" },
      { internalType: "uint16", name: "observationIndex", type: "uint16" },
      {
        internalType: "uint16",
        name: "observationCardinality",
        type: "uint16"
      },
      {
        internalType: "uint16",
        name: "observationCardinalityNext",
        type: "uint16"
      },
      { internalType: "uint8", name: "feeProtocol", type: "uint8" },
      { internalType: "bool", name: "unlocked", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" }
    ],
    name: "snapshotCumulativesInside",
    outputs: [
      { internalType: "int56", name: "tickCumulativeInside", type: "int56" },
      {
        internalType: "uint160",
        name: "secondsPerLiquidityInsideX128",
        type: "uint160"
      },
      { internalType: "uint32", name: "secondsInside", type: "uint32" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "bool", name: "zeroForOne", type: "bool" },
      { internalType: "int256", name: "amountSpecified", type: "int256" },
      { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "swap",
    outputs: [
      { internalType: "int256", name: "amount0", type: "int256" },
      { internalType: "int256", name: "amount1", type: "int256" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "int16", name: "", type: "int16" }],
    name: "tickBitmap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "tickSpacing",
    outputs: [{ internalType: "int24", name: "", type: "int24" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "int24", name: "", type: "int24" }],
    name: "ticks",
    outputs: [
      { internalType: "uint128", name: "liquidityGross", type: "uint128" },
      { internalType: "int128", name: "liquidityNet", type: "int128" },
      {
        internalType: "uint256",
        name: "feeGrowthOutside0X128",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "feeGrowthOutside1X128",
        type: "uint256"
      },
      { internalType: "int56", name: "tickCumulativeOutside", type: "int56" },
      {
        internalType: "uint160",
        name: "secondsPerLiquidityOutsideX128",
        type: "uint160"
      },
      { internalType: "uint32", name: "secondsOutside", type: "uint32" },
      { internalType: "bool", name: "initialized", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "token0",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "token1",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
];

// src/elektrik/pool.ts
var _findPoolAddress = async (factoryAddress, provider, fromToken, toToken, fee = import_v3_sdk.FeeAmount.MEDIUM) => {
  const factoryContract = new import_ethers11.Contract(
    factoryAddress,
    IElektrikFactoryABI,
    provider
  );
  const [getPool] = requireMethods(factoryContract, "getPool");
  const poolAddress = await getPool(fromToken, toToken, fee);
  if (await provider.getCode(poolAddress) === "0x") return "0x";
  return poolAddress;
};
var findPoolAddress = async (factoryAddress, provider, fromToken, toToken) => {
  const fees = [import_v3_sdk.FeeAmount.MEDIUM, import_v3_sdk.FeeAmount.LOW, import_v3_sdk.FeeAmount.HIGH];
  for (const fee of fees) {
    const poolAddress = await _findPoolAddress(
      factoryAddress,
      provider,
      fromToken,
      toToken,
      fee
    );
    if (poolAddress !== "0x") return poolAddress;
  }
  throw new Error(
    `Pool not found for that Token pair ${fromToken} -> ${toToken}`
  );
};
var getPoolInfo = async (poolAddress, provider) => {
  const poolContract = new import_ethers11.Contract(poolAddress, IElektrikPoolABI, provider);
  const [feeCall, tickSpacingCall, liquidityCall, slot0Call] = requireMethods(
    poolContract,
    "fee",
    "tickSpacing",
    "liquidity",
    "slot0"
  );
  const [fee, tickSpacing, liquidity, slot0] = await Promise.all([
    feeCall(),
    tickSpacingCall(),
    liquidityCall(),
    slot0Call()
  ]);
  return {
    address: poolAddress,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1]
  };
};

// src/elektrik/allowance.ts
var import_ethers12 = require("ethers");

// src/abis/permit2.ts
var Permit2ABI = [
  {
    inputs: [{ internalType: "uint256", name: "deadline", type: "uint256" }],
    name: "AllowanceExpired",
    type: "error"
  },
  { inputs: [], name: "ExcessiveInvalidation", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "InsufficientAllowance",
    type: "error"
  },
  {
    inputs: [{ internalType: "uint256", name: "maxAmount", type: "uint256" }],
    name: "InvalidAmount",
    type: "error"
  },
  { inputs: [], name: "InvalidContractSignature", type: "error" },
  { inputs: [], name: "InvalidNonce", type: "error" },
  { inputs: [], name: "InvalidSignature", type: "error" },
  { inputs: [], name: "InvalidSignatureLength", type: "error" },
  { inputs: [], name: "InvalidSigner", type: "error" },
  { inputs: [], name: "LengthMismatch", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "signatureDeadline", type: "uint256" }
    ],
    name: "SignatureExpired",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint160",
        name: "amount",
        type: "uint160"
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "expiration",
        type: "uint48"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "Lockdown",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "newNonce",
        type: "uint48"
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "oldNonce",
        type: "uint48"
      }
    ],
    name: "NonceInvalidation",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint160",
        name: "amount",
        type: "uint160"
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "expiration",
        type: "uint48"
      },
      { indexed: false, internalType: "uint48", name: "nonce", type: "uint48" }
    ],
    name: "Permit",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "word",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mask",
        type: "uint256"
      }
    ],
    name: "UnorderedNonceInvalidation",
    type: "event"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "allowance",
    outputs: [
      { internalType: "uint160", name: "amount", type: "uint160" },
      { internalType: "uint48", name: "expiration", type: "uint48" },
      { internalType: "uint48", name: "nonce", type: "uint48" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint160", name: "amount", type: "uint160" },
      { internalType: "uint48", name: "expiration", type: "uint48" }
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint48", name: "newNonce", type: "uint48" }
    ],
    name: "invalidateNonces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "wordPos", type: "uint256" },
      { internalType: "uint256", name: "mask", type: "uint256" }
    ],
    name: "invalidateUnorderedNonces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "address", name: "spender", type: "address" }
        ],
        internalType: "struct IAllowanceTransfer.TokenSpenderPair[]",
        name: "approvals",
        type: "tuple[]"
      }
    ],
    name: "lockdown",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "nonceBitmap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      {
        components: [
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint160", name: "amount", type: "uint160" },
              { internalType: "uint48", name: "expiration", type: "uint48" },
              { internalType: "uint48", name: "nonce", type: "uint48" }
            ],
            internalType: "struct IAllowanceTransfer.PermitDetails[]",
            name: "details",
            type: "tuple[]"
          },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "sigDeadline", type: "uint256" }
        ],
        internalType: "struct IAllowanceTransfer.PermitBatch",
        name: "permitBatch",
        type: "tuple"
      },
      { internalType: "bytes", name: "signature", type: "bytes" }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      {
        components: [
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint160", name: "amount", type: "uint160" },
              { internalType: "uint48", name: "expiration", type: "uint48" },
              { internalType: "uint48", name: "nonce", type: "uint48" }
            ],
            internalType: "struct IAllowanceTransfer.PermitDetails",
            name: "details",
            type: "tuple"
          },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "sigDeadline", type: "uint256" }
        ],
        internalType: "struct IAllowanceTransfer.PermitSingle",
        name: "permitSingle",
        type: "tuple"
      },
      { internalType: "bytes", name: "signature", type: "bytes" }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" }
            ],
            internalType: "struct ISignatureTransfer.TokenPermissions",
            name: "permitted",
            type: "tuple"
          },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct ISignatureTransfer.PermitTransferFrom",
        name: "permit",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "requestedAmount", type: "uint256" }
        ],
        internalType: "struct ISignatureTransfer.SignatureTransferDetails",
        name: "transferDetails",
        type: "tuple"
      },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "bytes", name: "signature", type: "bytes" }
    ],
    name: "permitTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" }
            ],
            internalType: "struct ISignatureTransfer.TokenPermissions[]",
            name: "permitted",
            type: "tuple[]"
          },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct ISignatureTransfer.PermitBatchTransferFrom",
        name: "permit",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "requestedAmount", type: "uint256" }
        ],
        internalType: "struct ISignatureTransfer.SignatureTransferDetails[]",
        name: "transferDetails",
        type: "tuple[]"
      },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "bytes", name: "signature", type: "bytes" }
    ],
    name: "permitTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" }
            ],
            internalType: "struct ISignatureTransfer.TokenPermissions",
            name: "permitted",
            type: "tuple"
          },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct ISignatureTransfer.PermitTransferFrom",
        name: "permit",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "requestedAmount", type: "uint256" }
        ],
        internalType: "struct ISignatureTransfer.SignatureTransferDetails",
        name: "transferDetails",
        type: "tuple"
      },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "bytes32", name: "witness", type: "bytes32" },
      { internalType: "string", name: "witnessTypeString", type: "string" },
      { internalType: "bytes", name: "signature", type: "bytes" }
    ],
    name: "permitWitnessTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" }
            ],
            internalType: "struct ISignatureTransfer.TokenPermissions[]",
            name: "permitted",
            type: "tuple[]"
          },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct ISignatureTransfer.PermitBatchTransferFrom",
        name: "permit",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "requestedAmount", type: "uint256" }
        ],
        internalType: "struct ISignatureTransfer.SignatureTransferDetails[]",
        name: "transferDetails",
        type: "tuple[]"
      },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "bytes32", name: "witness", type: "bytes32" },
      { internalType: "string", name: "witnessTypeString", type: "string" },
      { internalType: "bytes", name: "signature", type: "bytes" }
    ],
    name: "permitWitnessTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint160", name: "amount", type: "uint160" },
          { internalType: "address", name: "token", type: "address" }
        ],
        internalType: "struct IAllowanceTransfer.AllowanceTransferDetails[]",
        name: "transferDetails",
        type: "tuple[]"
      }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint160", name: "amount", type: "uint160" },
      { internalType: "address", name: "token", type: "address" }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// src/elektrik/allowance.ts
async function ensureApproval(provider, wallet, token, target, amount) {
  const senderAddress = await wallet.getAddress();
  const tokenContract = new import_ethers12.Contract(token, ERC20ABI, provider);
  const [allowanceMethod] = requireMethods(tokenContract, "allowance");
  let allowance = await allowanceMethod(senderAddress, target);
  if (allowance < amount) {
    console.log("Approving token transfer", target, amount);
    const callData = await tokenContract.interface.encodeFunctionData(
      "approve",
      [target, amount]
    );
    const tx = await wallet.sendTransaction({
      to: token,
      data: callData
    });
    await tx.wait();
    allowance = amount;
  }
  return allowance;
}
var ensurePermit2 = async (provider, wallet, permit2, token, target, amount) => {
  await ensureApproval(provider, wallet, token, permit2, amount);
  const senderAddress = await wallet.getAddress();
  const permit2Contract = new import_ethers12.Contract(permit2, Permit2ABI, provider);
  const [allowanceMethod] = requireMethods(permit2Contract, "allowance");
  const allowance = await allowanceMethod(senderAddress, token, target);
  if (allowance >= amount) {
    return;
  }
  await approvePermit2(provider, wallet, permit2, token, target, amount);
};
var approvePermit2 = async (provider, wallet, permit2, token, target, amount) => {
  const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
  const deadline = Math.floor(Date.now() / 1e3) + ONE_DAY_IN_SECONDS;
  const permit2Contract = new import_ethers12.Contract(permit2, Permit2ABI, provider);
  const callData = await permit2Contract.interface.encodeFunctionData(
    "approve",
    [token, target, amount, deadline]
  );
  const tx = await wallet.sendTransaction({
    to: permit2,
    data: callData
  });
  await tx.wait();
  return tx;
};

// src/elektrik/swap.ts
var swapExactIn = async (provider, wallet, permit2, factoryAddress, routerAddress, amountIn, tokenIn, tokenOut, slippage) => {
  const poolInfo = await getPoolInfo(
    await findPoolAddress(factoryAddress, provider, tokenIn, tokenOut),
    provider
  );
  console.log("GOT POOL ADDRESS", poolInfo.address, poolInfo.fee);
  const amountOutMin = 1n;
  await ensurePermit2(
    provider,
    wallet,
    permit2,
    tokenIn,
    routerAddress,
    amountIn
  );
  const router = new universalRouter_default(routerAddress, provider);
  const tx = await router.swapExactIn(wallet, amountIn, amountOutMin, {
    tokenIn,
    tokenOut,
    fee: Number(poolInfo.fee)
  });
  return tx;
};

// src/tools/swap_exact_input.ts
var SwapExactInputToolDefinition = {
  name: "swap_exact_input",
  description: "Swap exact input in the Elektrik DEX, will fail if user has insufficient balance in the input token.",
  schema: import_zod8.z.object({
    amount: import_zod8.z.string().describe("The amount to swap, e.g. 1.2345"),
    fromToken: import_zod8.z.string().describe("The asset address to swap from. (must be a token)"),
    toToken: import_zod8.z.string().describe("The asset address to swap to. (must be a token)"),
    slippage: import_zod8.z.number().optional().describe("Slippage tolerance (default: 0.01 for 1%)")
  })
};
var swapExactInput = async (wallet, params) => {
  const network = wallet.getNetworkInfo();
  if (!network.elektrik)
    throw new Error("Elektrik DEX not setup for this network");
  if (!network.permit2) throw new Error("Permit2 not setup for this network");
  const provider = makeNetworkProvider(network);
  const senderAddress = await wallet.getAddress();
  const tokenIn = new import_ethers13.Contract(params.fromToken, ERC20ABI, provider);
  const decimals = await tokenIn.decimals();
  const amountIn = (0, import_ethers13.parseUnits)(params.amount, decimals);
  const balance = await tokenIn.balanceOf(senderAddress);
  if (balance < amountIn) {
    throw new Error(
      `Insufficient balance in input token ${params.fromToken} for amount ${params.amount}`
    );
  }
  const tx = await swapExactIn(
    provider,
    wallet,
    network.permit2,
    network.elektrik.factoryAddress,
    network.elektrik.routerAddress,
    amountIn,
    params.fromToken,
    params.toToken,
    params.slippage || 0.01
  );
  return {
    status: "success",
    txHash: tx.hash
  };
};

// src/tools/resolve_ens_domain.ts
var import_zod9 = require("zod");

// src/ens/index.ts
var import_ethers15 = require("ethers");
var import_utils4 = require("@web3-name-sdk/core/utils");
var import_core = require("@web3-name-sdk/core");

// src/ens/lldomain.ts
var import_utils3 = require("@web3-name-sdk/core/utils");
var import_ethers14 = require("ethers");
var ENSRegistryABI = [
  "function resolver(bytes32 node) external view returns (address)"
];
var ResolverABI = [
  "function addr(bytes32 node) external view returns (address)"
];
var LL_TLD_INFO = {
  tld: "ll",
  identifier: 50980310089186268088337308227696701776159000940410532847939554039755637n,
  chainId: 1890,
  defaultRpcUrl: "https://replicator.phoenix.lightlink.io/rpc/v1",
  registry: "0x5dC881dDA4e4a8d312be3544AD13118D1a04Cb17",
  sann: "0x9af6F1244df403dAe39Eb2D0be1C3fD0B38e0789"
};
var resolveLLDomain = async (normalizedDomain) => {
  const provider = makeNetworkProvider(NETWORKS.PhoenixMainnet);
  const ensAddress = NETWORKS.PhoenixMainnet.ens.address;
  const nameHash = (0, import_utils3.tldNamehash)(normalizedDomain, LL_TLD_INFO.identifier);
  const ensRegistry = new import_ethers14.Contract(ensAddress, ENSRegistryABI, provider);
  const resolverAddress = await ensRegistry.resolver(nameHash);
  const ensResolver = new import_ethers14.Contract(resolverAddress, ResolverABI, provider);
  const address = await ensResolver.addr(nameHash);
  return address;
};

// src/ens/index.ts
var resolveEnsName = async (name) => {
  const tld = name.split(".").pop();
  const normalizedDomain = (0, import_utils4.normalize)(name);
  if (tld === "ll") {
    return resolveLLDomain(normalizedDomain);
  }
  const web3Name = (0, import_core.createWeb3Name)();
  const address = await web3Name.getAddress(name);
  return address;
};

// src/tools/resolve_ens_domain.ts
var ResolveENSDomainToolDefinition = {
  name: "resolve_ens_domain",
  description: "Resolve any web3 name including ENS, LL domains to an address. e.g. vitalik.ll, vitalik.eth, vitalik.arb",
  schema: import_zod9.z.object({
    domain: import_zod9.z.string()
  })
};
var resolveENSDomain = async (_, params) => {
  console.log(`[resolve_ens_domain] Resolving '${params.domain}'`);
  const address = await resolveEnsName(params.domain);
  if (!address || address === "0x0000000000000000000000000000000000000000") {
    return {
      status: "failed",
      error: "ENS domain not found"
    };
  }
  return { status: "success", data: { address } };
};

// src/tools/index.ts
var createTools = (agent) => [
  new import_calculator.Calculator(),
  (0, import_tools2.tool)(json(err(withWallet(agent, sendTx))), SendTxToolDefinition),
  (0, import_tools2.tool)(json(err(withWallet(agent, callContract))), CallContractToolDefinition),
  (0, import_tools2.tool)(json(err(withWallet(agent, getBalance))), GetBalanceToolDefinition),
  (0, import_tools2.tool)(json(err(withWallet(agent, transfer))), TransferToolDefinition),
  (0, import_tools2.tool)(
    json(err(withWallet(agent, explorerSearch))),
    ExplorerSearchToolDefinition
  ),
  (0, import_tools2.tool)(json(err(withWallet(agent, networkStats))), NetworkStatsToolDefinition),
  (0, import_tools2.tool)(json(err(withWallet(agent, getAbi))), GetAbiToolDefinition),
  (0, import_tools2.tool)(
    json(err(withWallet(agent, swapExactInput))),
    SwapExactInputToolDefinition
  ),
  (0, import_tools2.tool)(
    json(err(withWallet(agent, resolveENSDomain))),
    ResolveENSDomainToolDefinition
  )
];
var json = (fn) => {
  return async (params) => JSON.stringify(await fn(params), (k, v) => {
    if (v instanceof BigInt) {
      return v.toString();
    }
    return v;
  });
};
var err = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      console.error("error", e);
      if (e instanceof Error || typeof e === "object" && e !== null && "message" in e) {
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

// src/agent.ts
var import_agents = require("langchain/agents");
var import_ethers16 = require("ethers");
var createSystemMessage = (network, address) => new import_messages.SystemMessage(
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
var createPrompt = (network, address) => import_prompts.ChatPromptTemplate.fromMessages([
  createSystemMessage(network, address),
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"]
]);
var models = [
  "gpt-4o",
  "gpt-4o-mini",
  "claude-3-5-sonnet-latest",
  "claude-3-5-haiku-latest"
];
var createAgent = (address, walletProvider, opts) => {
  if (!models.includes(opts.model)) {
    throw new Error(`Invalid model: ${opts.model}`);
  }
  const useDefaultTools = opts.useDefaultTools ?? true;
  console.log("[createAgent] Creating agent with model:", opts.model);
  let selectedModel;
  if (opts.model === "gpt-4o" || opts.model === "gpt-4o-mini") {
    if (!opts.openAiApiKey) {
      throw new Error("OpenAI API key is required for GPT models");
    }
    selectedModel = new import_openai.ChatOpenAI({
      modelName: opts.model,
      apiKey: opts.openAiApiKey
    });
  } else if (opts.model === "claude-3-5-sonnet-latest" || opts.model === "claude-3-5-haiku-latest") {
    if (!opts.anthropicApiKey) {
      throw new Error("Anthropic API key is required for Claude models");
    }
    selectedModel = new import_anthropic.ChatAnthropic({
      modelName: opts.model,
      apiKey: opts.anthropicApiKey
    });
  }
  if (selectedModel === void 0) {
    throw new Error("Unsupported model");
  }
  const prompt = createPrompt(walletProvider.getNetworkInfo(), address);
  const tools = [
    ...opts.tools ?? []
  ];
  if (useDefaultTools) {
    tools.push(...createTools(walletProvider));
  }
  const agent = (0, import_agents.createToolCallingAgent)({
    llm: selectedModel,
    tools,
    prompt
  });
  return new import_agents.AgentExecutor({
    agent,
    tools,
    verbose: process.env.VERBOSE === "true"
  });
};

// src/wallet.ts
var import_ethers17 = require("ethers");
var PrivateKeyWalletProvider = class {
  privateKey;
  network;
  constructor(privateKey, network) {
    this.privateKey = privateKey;
    this.network = network;
  }
  async getAddress() {
    return await new import_ethers17.Wallet(this.privateKey).getAddress();
  }
  async signTransaction(tx) {
    return await new import_ethers17.Wallet(this.privateKey).signTransaction(tx);
  }
  async sendTransaction(tx) {
    return await new import_ethers17.Wallet(this.privateKey).sendTransaction(tx);
  }
  getNetworkInfo() {
    return this.network;
  }
};

// src/llchat.ts
var import_messages2 = require("@langchain/core/messages");
var import_chat_history = require("@langchain/core/chat_history");
var import_runnables = require("@langchain/core/runnables");
var LLChatSession = class {
  agent;
  chain;
  history;
  constructor(agent, history) {
    this.agent = agent;
    this.history = history ?? new import_chat_history.InMemoryChatMessageHistory();
    this.chain = new import_runnables.RunnableWithMessageHistory({
      runnable: this.agent,
      getMessageHistory: (_sessionId) => this.history,
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history"
    });
  }
  /**
   * Send a message to the agent and return the response
   * The message and the response are added to the history
   * @param message - The message to send to the agent
   * @returns The response from the agent
   */
  async say(message) {
    const result = await this.execute(new import_messages2.HumanMessage(message));
    return result.output;
  }
  /**
   * Execute the agent with a list of messages
   * The messages are added to the history
   * @param messages - The list of messages to execute the agent with
   * @returns The result of the agent execution
   */
  async execute(...messages) {
    if (messages.length === 0) throw new Error("No messages provided");
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      if (msg) {
        await this.history.addMessage(msg);
      }
    }
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) throw new Error("No last message provided");
    console.log(
      "[LLChatSession:execute] \u{1F4AC} '" + lastMessage.content.toString() + "'"
    );
    const result = await this.chain.invoke(
      {
        input: lastMessage
      },
      { configurable: { sessionId: "unused" } }
    );
    return result;
  }
  async stream(...messages) {
    if (messages.length === 0) throw new Error("No messages provided");
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      if (msg) {
        await this.history.addMessage(msg);
      }
    }
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) throw new Error("No last message provided");
    const stream = this.chain.streamEvents(
      {
        input: lastMessage
      },
      { configurable: { sessionId: "unused" }, version: "v2" }
    );
    return stream;
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
};

// src/llagent.ts
var import_ethers18 = require("ethers");
var LLAgent = class _LLAgent {
  agent;
  walletProvider;
  opts;
  constructor(cfg) {
    this.walletProvider = cfg.walletProvider;
    this.opts = cfg;
    this.agent = createAgent(cfg.address, this.walletProvider, cfg);
  }
  static async fromPrivateKey(privateKey, network, opts) {
    const walletProvider = new PrivateKeyWalletProvider(privateKey, network);
    const address = await walletProvider.getAddress();
    return new _LLAgent({ ...opts, address, walletProvider });
  }
  /**
   * Execute the agent with a given input.
   * @returns An object containing the agent's response.
   */
  async execute(input) {
    console.log("[LLAgent:execute] \u{1F4AC} '" + input + "'");
    const response = await this.agent.invoke({ input });
    return response;
  }
  /**
   * Stream the agent's response to a given input.
   * @param input - The input to stream.
   * @returns A stream of agent responses.
   */
  async stream(input) {
    console.log("[LLAgent:execute] \u{1F4AC} '" + input + "'");
    return await this.agent.stream({
      input
    });
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
  async transfer(params) {
    return await transfer(this.walletProvider, params);
  }
  /**
   * Get the balance of the agent's wallet.
   * @returns An object containing the balance of the wallet.
   */
  async getBalance(params) {
    return await getBalance(this.walletProvider, params);
  }
  /**
   * Send a transaction from the agent's wallet.
   * @returns An object containing the transaction hash.
   */
  async sendTransaction(params) {
    return await sendTx(this.walletProvider, params);
  }
  /**
   * Call a contract function.
   * @returns An object containing the result of the contract call.
   */
  async callContract(params) {
    return await callContract(this.walletProvider, params);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LLAgent,
  LLChatSession,
  NETWORKS,
  makeNetworkProvider
});
