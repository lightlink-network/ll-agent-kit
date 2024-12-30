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
let message: string = "What is the balance of the account?";
if (process.argv.length > 2) {
  message = process.argv.slice(2).join(" ");
}

console.log("\n");
console.log("[DEMO] Sending Request to Agent");
const result = await agent.execute(message);
console.log("\n");
console.log(result);
