import { Serper } from "@langchain/community/tools/serper";
import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";

import { RESEARCHER_PROMPT } from "@/agents/researcher/prompt";
import { validateUrl } from "@/agents/researcher/tools";
import { type ResearchResult, ResearchResultSchema } from "@/types";

import { createAgentMiddleware, createModel } from "@/utils/";

const searchTool = new Serper(process.env.SERPER_API_KEY);

export async function runResearcher(
	idea: string,
	config?: RunnableConfig,
): Promise<ResearchResult> {
	const model = createModel(800);

	const researcherAgent = createAgent({
		name: "Researcher Agent",
		model,
		systemPrompt: RESEARCHER_PROMPT,
		responseFormat: ResearchResultSchema,
		tools: [searchTool, validateUrl],
		middleware: createAgentMiddleware("Researcher Agent"),
	});

	const result = await researcherAgent.invoke(
		{ messages: [{ role: "user", content: idea }] },
		config,
	);

	return result.structuredResponse;
}
