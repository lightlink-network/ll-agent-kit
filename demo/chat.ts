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

const chat = agent.chat();
console.log("\n");
console.log(`[LLAgent]: `, await chat.say("Hello my name is 'Kass'"));
console.log("\n");
console.log(`[LLAgent]: `, await chat.say("What is my name?"));
console.log("\n");
console.log(`[LLAgent]: `, await chat.say("How much balance do I have?"));
console.log("\n");
