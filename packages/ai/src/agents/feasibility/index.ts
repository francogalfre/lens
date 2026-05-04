import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";
import { FEASIBILITY_PROMPT } from "./prompt";
import {
	type FeasibilityResult,
	FeasibilityResultSchema,
} from "../../graph/schemas";
import { createLogger } from "../../logger";
import { getModel } from "../../utils";

export async function runFeasibility(
	idea: string,
	config?: RunnableConfig,
): Promise<FeasibilityResult> {
	const logger = createLogger(config);

	try {
		logger.info("Starting feasibility");

		const response = await getModel(async (llm) => {
			const agent = createAgent({
				model: llm,
				tools: [],
				systemPrompt: FEASIBILITY_PROMPT,
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

		const result = FeasibilityResultSchema.parse(JSON.parse(content));
		logger.info("Feasibility completed", { complexity: result.complexity });

		return result;
	} catch (error) {
		logger.error("Feasibility failed", {
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}
