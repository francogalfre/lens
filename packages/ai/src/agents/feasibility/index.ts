import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";
import { FEASIBILITY_PROMPT } from "@/agents/feasibility/prompt";
import { type FeasibilityResult, FeasibilityResultSchema } from "@/types";
import { createLoggingMiddleware } from "@/utils/middleware";
import { createModel } from "@/utils/model";

export async function runFeasibility(
	idea: string,
	config?: RunnableConfig,
): Promise<FeasibilityResult> {
	const model = createModel(1200);

	const feasibilityAgent = createAgent({
		name: "Feasibility Agent",
		model,
		systemPrompt: FEASIBILITY_PROMPT,
		responseFormat: FeasibilityResultSchema,
		tools: [],
		middleware: [createLoggingMiddleware("Feasibility Agent")],
	});

	const result = await feasibilityAgent.invoke(
		{
			messages: [{ role: "user", content: idea }],
		},
		config,
	);

	return result.structuredResponse;
}
