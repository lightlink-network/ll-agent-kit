import "dotenv/config";
import { LLAgent } from "../src/llagent.js";
import { NETWORKS } from "../src/network.js";

console.log("\n");
console.log("[DEMO] Creating agent");
const agent = new LLAgent({
  privateKey: process.env.PRIVATE_KEY ?? "",
  network: NETWORKS.PegasusTestnet,
  model: "gpt-4o",
  openAiApiKey: process.env.OPENAI_API_KEY,
});

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
