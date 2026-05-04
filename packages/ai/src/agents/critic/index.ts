import { createAgent } from "langchain";

import { getModel } from "@/utils";
import { CRITIC_PROMPT } from "@/agents/critic/prompt";

import { type CritiqueResult, CritiqueResultSchema } from "@/graph/schemas";

export async function runCritic(idea: string): Promise<CritiqueResult> {
  const response = await getModel(async (llm) => {
    const agent = createAgent({
      model: llm,
      tools: [],
      systemPrompt: CRITIC_PROMPT,
    });

    return agent.invoke({
      messages: [
        {
          role: "user",
          content: idea,
        },
      ],
    });
  });

  const lastMessage = response.messages[response.messages.length - 1];
  const content =
    typeof lastMessage?.content === "string"
      ? lastMessage.content
      : String(lastMessage?.content);

  return CritiqueResultSchema.parse(JSON.parse(content));
}
