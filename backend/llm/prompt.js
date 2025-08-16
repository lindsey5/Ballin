import { ChatPromptTemplate } from "@langchain/core/prompts";

export const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful customer assistant for Ballin Website. Answer the following questions: {query}"],
  ["user", "{query}"],
]);