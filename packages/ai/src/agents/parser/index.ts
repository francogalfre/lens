import { createAgent } from "langchain";
import { getModel } from "@/utils";

import { PARSER_PROMPT } from "@/agents/parser/prompt";
import { type ParsedIdea, ParsedIdeaSchema } from "@/graph/schemas";

export async function runParser(idea: string): Promise<ParsedIdea> {
  const response = await getModel(async (llm) => {
    const agent = createAgent({
      model: llm,
      tools: [],
      systemPrompt: PARSER_PROMPT,
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

  return ParsedIdeaSchema.parse(JSON.parse(content));
}
