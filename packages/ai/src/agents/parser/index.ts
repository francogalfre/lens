import type { RunnableConfig } from "@langchain/core/runnables";
import { z } from "zod";

import { createModel } from "@/utils/model";
import { PARSER_PROMPT } from "./prompt";

const ParserOutputSchema = z.object({
	validationError: z.string().optional(),
	problem: z.string().optional(),
	solution: z.string().optional(),
	targetAudience: z.string().optional(),
	techDomain: z.string().optional(),
	category: z.string().optional(),
	summary: z.string().optional(),
});

export type ParserResult =
	| { validationError: string }
	| {
			problem: string;
			solution: string;
			targetAudience: string;
			techDomain: string;
			category: string;
			summary: string;
	  };

export async function runParser(
	idea: string,
	config?: RunnableConfig,
): Promise<ParserResult> {
	const model = createModel(512);
	const raw = await model.withStructuredOutput(ParserOutputSchema).invoke(
		[
			{ role: "system", content: PARSER_PROMPT },
			{ role: "user", content: idea },
		],
		config,
	);

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
