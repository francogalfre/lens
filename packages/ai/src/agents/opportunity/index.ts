import type { RunnableConfig } from "@langchain/core/runnables";

import {
	type OpportunityResult,
	OpportunityResultSchema,
} from "@/graph/schemas";
import { createModel } from "@/utils/model";
import { OPPORTUNITY_PROMPT } from "./prompt";

export async function runOpportunity(
	idea: string,
	config?: RunnableConfig,
): Promise<OpportunityResult> {
	const model = createModel(1200);

	return model.withStructuredOutput(OpportunityResultSchema).invoke(
		[
			{ role: "system", content: OPPORTUNITY_PROMPT },
			{ role: "user", content: idea },
		],
		config,
	);
}
