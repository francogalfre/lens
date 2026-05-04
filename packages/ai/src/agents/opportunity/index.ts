import { createAgent } from "langchain";

import { getModel } from "@/utils";
import { OPPORTUNITY_PROMPT } from "@/agents/opportunity/prompt";

import { type OpportunityResult, OpportunityResultSchema } from "@/graph/schemas";

export async function runOpportunity(idea: string): Promise<OpportunityResult> {
	const response = await getModel(async (llm) => {
		const agent = createAgent({
			model: llm,
			tools: [],
			systemPrompt: OPPORTUNITY_PROMPT,
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

	return OpportunityResultSchema.parse(JSON.parse(content));
}
