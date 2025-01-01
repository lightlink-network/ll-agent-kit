import "dotenv/config";
import { LLAgent, NETWORKS } from "../dist/index.js";

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
console.log(`[LLAgent]: `, await chat.say("Do I have any USDT?"));
console.log("\n");
console.log(`[LLAgent]: `, await chat.say("How is the network doing?"));
console.log("\n");
