import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";
import { CRITIC_PROMPT } from "@/agents/critic/prompt";
import { type CritiqueResult, CritiqueResultSchema } from "@/types";
import { createLoggingMiddleware } from "@/utils/middleware";
import { createModel } from "@/utils/model";

export async function runCritic(
	idea: string,
	config?: RunnableConfig,
): Promise<CritiqueResult> {
	const model = createModel(1200);

	const criticAgent = createAgent({
		name: "Critic Agent",
		model,
		systemPrompt: CRITIC_PROMPT,
		responseFormat: CritiqueResultSchema,
		tools: [],
		middleware: [createLoggingMiddleware("Critic Agent")],
	});

	const result = await criticAgent.invoke(
		{
			messages: [{ role: "user", content: idea }],
		},
		config,
	);

	return result.structuredResponse;
}
