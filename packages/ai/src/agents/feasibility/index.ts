import type { RunnableConfig } from "@langchain/core/runnables";

import {
	type FeasibilityResult,
	FeasibilityResultSchema,
} from "@/graph/schemas";
import { createModel } from "@/utils/model";
import { FEASIBILITY_PROMPT } from "./prompt";

export async function runFeasibility(
	idea: string,
	config?: RunnableConfig,
): Promise<FeasibilityResult> {
	const model = createModel(1200);

	return model.withStructuredOutput(FeasibilityResultSchema).invoke(
		[
			{ role: "system", content: FEASIBILITY_PROMPT },
			{ role: "user", content: idea },
		],
		config,
	);
}
