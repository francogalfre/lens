import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";
import { type ParsedIdea, ParsedIdeaSchema } from "../../graph/schemas";
import { createLogger } from "../../logger";
import { getModel } from "../../utils";
import { PARSER_PROMPT } from "./prompt";

export type ParserResult = ParsedIdea | { validationError: string };

export async function runParser(
	idea: string,
	config?: RunnableConfig,
): Promise<ParserResult> {
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

		const data = JSON.parse(content);

		if ("validationError" in data) {
			logger.info("Parser rejected input", { reason: data.validationError });
			return { validationError: data.validationError };
		}

		const parsed = ParsedIdeaSchema.parse(data);

		if (!parsed.problem.trim() || !parsed.solution.trim()) {
			return { validationError: "This does not appear to be a valid startup or project idea." };
		}

		logger.info("Parser completed", { category: parsed.category });

		return parsed;
	} catch (error) {
		logger.error("Parser failed", {
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}
