import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";
import { CRITIC_PROMPT } from "@/agents/critic/prompt";
import { type CritiqueResult, CritiqueResultSchema } from "@/graph/schemas";
import { createLogger } from "@/logger";
import { getModel } from "@/utils";

export async function runCritic(
	idea: string,
	config?: RunnableConfig,
): Promise<CritiqueResult> {
	const logger = createLogger(config);

	try {
		logger.info("Starting critic");

		const response = await getModel(async (llm) => {
			const agent = createAgent({
				model: llm,
				tools: [],
				systemPrompt: CRITIC_PROMPT,
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

		const result = CritiqueResultSchema.parse(JSON.parse(content));
		logger.info("Critic completed", { risksCount: result.risks?.length || 0 });

		return result;
	} catch (error) {
		logger.error("Critic failed", {
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}
