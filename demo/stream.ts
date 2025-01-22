import "dotenv/config";
import { LLAgent, NETWORKS } from "../dist/index.js";

console.log("\n");
console.log("[DEMO] Creating agent");
const agent = await LLAgent.fromPrivateKey(
  process.env.PRIVATE_KEY ?? "",
  NETWORKS.PegasusTestnet,
  { model: "gpt-4o", openAiApiKey: process.env.OPENAI_API_KEY }
);

// get message from user
let message: string =
  "If I spent 0.015 ETH on a transaction, how much ETH would I have left?";
if (process.argv.length > 2) {
  message = process.argv.slice(2).join(" ");
}

const stream = await agent.stream(message);

for await (const chunk of stream) {
  if (chunk.output) {
    console.log("\n\nOutput: ", chunk.output);
  }

  if (!chunk.intermediateSteps) continue;
  for (const step of chunk.intermediateSteps) {
    console.log(`[Step]`, step.action.log);
    if (step.action.tool) console.log(` ├─ Tool ${step.action.tool}`);
    if (step.action.toolInput)
      console.log(` ├─ Tool Input: ${JSON.stringify(step.action.toolInput)}`);
    if (step.observation) console.log(` └─ Observation: ${step.observation}`);
  }
}
