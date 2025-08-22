import { ChatPromptTemplate } from "@langchain/core/prompts";

export const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "You're Ali a helpful customer assistant for Ballin. Answer the following questions: {query}"],
  ["user", "{query}"],
]);