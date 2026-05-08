import type { RunnableConfig } from "@langchain/core/runnables";

import { type CritiqueResult, CritiqueResultSchema } from "@/graph/schemas";
import { createModel } from "@/utils/model";
import { CRITIC_PROMPT } from "./prompt";

export async function runCritic(
	idea: string,
	config?: RunnableConfig,
): Promise<CritiqueResult> {
	const model = createModel(1200);

	return model.withStructuredOutput(CritiqueResultSchema).invoke(
		[
			{ role: "system", content: CRITIC_PROMPT },
			{ role: "user", content: idea },
		],
		config,
	);
}
