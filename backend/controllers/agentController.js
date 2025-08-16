import { promptTemplate } from "../llm/prompt.js";
import agent from "../llm/AI_agent.mjs";
import { HumanMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";

export const chatAIagent = async (req, res) => {
  try {
    const message = req.body.message || '';

    let threadId = req.cookies?.thread_id;
    if (!threadId) {
      threadId = uuidv4();
      res.cookie("thread_id", threadId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    }

    const formattedPrompt = await promptTemplate.format({ query: message });
    
    const agentState = await agent.invoke(
      { messages: [new HumanMessage(formattedPrompt)] },
      { configurable: { thread_id: threadId } }
    );

    const responseContent = agentState.messages[agentState.messages.length - 1].content;

    res.status(200).json({ success: true, response: responseContent });

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};