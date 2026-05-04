import { createAgent } from "langchain";

import { getModel } from "@/utils";
import { FEASIBILITY_PROMPT } from "@/agents/feasibility/prompt";

import { type FeasibilityResult, FeasibilityResultSchema } from "@/graph/schemas";

export async function runFeasibility(idea: string): Promise<FeasibilityResult> {
	const response = await getModel(async (llm) => {
		const agent = createAgent({
			model: llm,
			tools: [],
			systemPrompt: FEASIBILITY_PROMPT,
		});

		return agent.invoke({
			messages: [
				{
					role: "user",
					content: idea,
				},
			],
		});
	});

	const lastMessage = response.messages[response.messages.length - 1];
	const content =
		typeof lastMessage?.content === "string"
			? lastMessage.content
			: String(lastMessage?.content);

	return FeasibilityResultSchema.parse(JSON.parse(content));
}
