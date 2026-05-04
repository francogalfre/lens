import { Serper } from "@langchain/community/tools/serper";
import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";
import { RESEARCHER_PROMPT } from "@/agents/researcher/prompt";
import { type ResearchResult, ResearchResultSchema } from "@/graph/schemas";
import { createLogger } from "@/logger";
import { getModel } from "@/utils";

const searchTool = new Serper(process.env.SERPER_API_KEY);

export async function runResearcher(
	idea: string,
	config?: RunnableConfig,
): Promise<ResearchResult> {
	const logger = createLogger(config);

	try {
		logger.info("Starting researcher");

		const response = await getModel(async (llm) => {
			const agent = createAgent({
				model: llm,
				tools: [searchTool],
				systemPrompt: RESEARCHER_PROMPT,
			});

			return agent.invoke(
				{
					messages: [{ role: "user", content: `Research this idea: ${idea}` }],
				},
				config,
			);
		});

		const lastMessage = response.messages[response.messages.length - 1];
		const content =
			typeof lastMessage?.content === "string"
				? lastMessage.content
				: String(lastMessage?.content);

		let result: ResearchResult;
		try {
			const parsed = JSON.parse(content);
			result = ResearchResultSchema.parse(parsed);
		} catch (e) {
			logger.warn("Failed to parse research JSON, using fallback");
			result = ResearchResultSchema.parse({
				competitors: [],
				marketContext: content,
				searchQueries: [],
				opportunities: [],
			});
		}

		logger.info("Researcher completed", {
			competitorsCount: result.competitors?.length || 0,
		});
		return result;
	} catch (error) {
		logger.error("Researcher failed", {
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}
