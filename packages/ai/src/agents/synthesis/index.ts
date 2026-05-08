import type { RunnableConfig } from "@langchain/core/runnables";

import {
	type CritiqueResult,
	type FeasibilityResult,
	type OpportunityResult,
	type ParsedIdea,
	type ResearchResult,
	type SynthesisResult,
	SynthesisResultSchema,
} from "@/graph/schemas";
import { createModel } from "@/utils/model";
import { SYNTHESIS_PROMPT } from "./prompt";

export interface SynthesisInput {
	parsedIdea: ParsedIdea;
	research: ResearchResult;
	critique: CritiqueResult;
	opportunities: OpportunityResult;
	feasibility: FeasibilityResult;
}

export async function runSynthesis(
	input: SynthesisInput,
	config?: RunnableConfig,
): Promise<SynthesisResult> {
	const model = createModel(1024);
	return model.withStructuredOutput(SynthesisResultSchema).invoke(
		[
			{ role: "system", content: SYNTHESIS_PROMPT },
			{ role: "user", content: JSON.stringify(input, null, 2) },
		],
		config,
	);
}
