import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";

import { OPPORTUNITY_PROMPT } from "@/agents/opportunity/prompt";
import { type OpportunityResult, OpportunityResultSchema } from "@/types";
import { createAgentMiddleware } from "@/utils/middleware";
import { createModel } from "@/utils/model";

export async function runOpportunity(
	idea: string,
	config?: RunnableConfig,
): Promise<OpportunityResult> {
	const model = createModel(700);

	const opportunityAgent = createAgent({
		name: "Opportunity Agent",
		model,
		systemPrompt: OPPORTUNITY_PROMPT,
		responseFormat: OpportunityResultSchema,
		tools: [],
		middleware: createAgentMiddleware("Opportunity Agent"),
	});

	const result = await opportunityAgent.invoke(
		{ messages: [{ role: "user", content: idea }] },
		config,
	);

	return result.structuredResponse;
}
