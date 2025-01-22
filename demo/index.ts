import "dotenv/config";
import { LLAgent, NETWORKS } from "../dist/index.js";

console.log("\n");
console.log("[DEMO] Creating agent");
const agent = await LLAgent.fromPrivateKey(
  process.env.PRIVATE_KEY ?? "",
  Object.values(NETWORKS),
  {
    model: "gpt-4o",
    openAiApiKey: process.env.OPENAI_API_KEY,
    defaultNetwork: NETWORKS.PegasusTestnet.chainId,
  }
);

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
