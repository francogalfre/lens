import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";
import { PARSER_PROMPT } from "@/agents/parser/prompt";
import { ParserOutputSchema, type ParserResult } from "@/types";
import { createLoggingMiddleware } from "@/utils/middleware";
import { createModel } from "@/utils/model";

export async function runParser(
	idea: string,
	config?: RunnableConfig,
): Promise<ParserResult> {
	const model = createModel(512);

	const parserAgent = createAgent({
		name: "Parser Agent",
		model,
		systemPrompt: PARSER_PROMPT,
		responseFormat: ParserOutputSchema,
		tools: [],
		middleware: [createLoggingMiddleware("Parser Agent")],
	});

	const result = await parserAgent.invoke(
		{
			messages: [{ role: "user", content: idea }],
		},
		config,
	);

	const raw = result.structuredResponse;

	if (raw.validationError) {
		return { validationError: raw.validationError };
	}

	if (!raw.problem?.trim() || !raw.solution?.trim()) {
		return {
			validationError:
				"This does not appear to be a valid startup or project idea.",
		};
	}

	return {
		problem: raw.problem,
		solution: raw.solution,
		targetAudience: raw.targetAudience ?? "",
		techDomain: raw.techDomain ?? "",
		category: raw.category ?? "",
		summary: raw.summary ?? "",
	};
}
