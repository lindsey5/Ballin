process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { productsTotalSoldTool, productTool } from "./tools.mjs";

// --- Initialize agent ---
const agentModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
});

const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools: [productTool, productsTotalSoldTool],
  checkpointSaver: agentCheckpointer,
});

export default agent