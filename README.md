# LightLink Agent (example)

LightLink Agent Kit is a library for building agents that can interact with the LightLink network. LightLink Agent Kit is built on top of LangChain.

See the live chat demo [here](https://ll-agentkit-chat-demo.vercel.app).

## Installation

```bash
npm install --save https://github.com/lightlink-network/ll-agent-kit.git
```

## Demo

A simple demo that lets you ask questions to the LightLink Agent on Pegasus testnet.

First set the required environment variables:

```bash
export PRIVATE_KEY=<your lightlink private key>
export OPENAI_API_KEY=<your openai api key>
```

(You can also set the environment variables in a `.env` file, see `.env.example` for more information)

Then run the demo:

```bash
npm run demo <your question or task?>
```

## Getting Started

```ts
const agent = new LLAgent({
  model: "gpt-4o",
  network: NETWORKS.PegasusTestnet,
  privateKey: process.env.PRIVATE_KEY!,
  openAiApiKey: process.env.OPENAI_API_KEY!,
});

// Send a task to the agent
const response = await agent.execute(
  "Send 0.01 ETH to 0x1234567890123456789012345678901234567890"
);
console.log(response.output);

// Or run functions directly
const tx = await agent.transfer({
  to: "0x1234567890123456789012345678901234567890",
  amount: "0.01",
});

console.log(tx.txHash);
```
