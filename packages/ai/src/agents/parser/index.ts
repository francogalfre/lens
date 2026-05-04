import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";
import { PARSER_PROMPT } from "@/agents/parser/prompt";
import { type ParsedIdea, ParsedIdeaSchema } from "@/graph/schemas";
import { createLogger } from "@/logger";
import { getModel } from "@/utils";

export async function runParser(
	idea: string,
	config?: RunnableConfig,
): Promise<ParsedIdea> {
	const logger = createLogger(config);

	try {
		logger.info("Starting parser", { ideaLength: idea.length });

		const response = await getModel(async (llm) => {
			const agent = createAgent({
				model: llm,
				tools: [],
				systemPrompt: PARSER_PROMPT,
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

		const parsed = ParsedIdeaSchema.parse(JSON.parse(content));
		logger.info("Parser completed", { category: parsed.category });

		return parsed;
	} catch (error) {
		logger.error("Parser failed", {
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}
