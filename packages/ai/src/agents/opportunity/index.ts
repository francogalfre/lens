import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";
import {
	type OpportunityResult,
	OpportunityResultSchema,
} from "../../graph/schemas";
import { createLogger } from "../../logger";
import { getModel } from "../../utils";
import { OPPORTUNITY_PROMPT } from "./prompt";

export async function runOpportunity(
	idea: string,
	config?: RunnableConfig,
): Promise<OpportunityResult> {
	const logger = createLogger(config);

	try {
		logger.info("Starting opportunity");

		const response = await getModel(async (llm) => {
			const agent = createAgent({
				model: llm,
				tools: [],
				systemPrompt: OPPORTUNITY_PROMPT,
			});

			return agent.invoke(
				{ messages: [{ role: "user", content: idea }] },
				config,
			);
		});

		const lastMessage = response.messages[response.messages.length - 1];
		const content =
			typeof lastMessage?.content === "string"
				? lastMessage.content
				: String(lastMessage?.content);

		const result = OpportunityResultSchema.parse(JSON.parse(content));
		logger.info("Opportunity completed", {
			opportunitiesCount: result.opportunities?.length || 0,
		});

		return result;
	} catch (error) {
		logger.error("Opportunity failed", {
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}
