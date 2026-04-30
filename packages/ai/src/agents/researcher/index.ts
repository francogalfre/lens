import { createAgent } from "langchain";
import { Serper } from "@langchain/community/tools/serper";

import { getModel } from "@/utils";
import { RESEARCHER_PROMPT } from "@/agents/researcher/prompt";

import { type ResearchResult, ResearchResultSchema } from "@/graph/schemas";

const searchTool = new Serper(process.env.SERPER_API_KEY);

export async function runResearcher(idea: string): Promise<ResearchResult> {
  const response = await getModel(async (llm) => {
    const agent = createAgent({
      model: llm,
      tools: [searchTool],
      systemPrompt: RESEARCHER_PROMPT,
    });

    return agent.invoke({
      messages: [
        {
          role: "user",
          content: `Research this idea: ${idea}`,
        },
      ],
    });
  });

  const lastMessage = response.messages[response.messages.length - 1];
  const content =
    typeof lastMessage?.content === "string"
      ? lastMessage.content
      : String(lastMessage?.content);

  try {
    const parsed = JSON.parse(content);
    return ResearchResultSchema.parse(parsed);
  } catch {
    return ResearchResultSchema.parse({
      competitors: [],
      marketContext: content,
      searchQueries: [],
      opportunities: [],
    });
  }
}
