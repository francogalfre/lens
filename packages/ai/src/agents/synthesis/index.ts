import { createAgent } from "langchain";

import { getModel } from "@/utils";
import { SYNTHESIS_PROMPT } from "@/agents/synthesis/prompt";

import {
	type CritiqueResult,
	type FeasibilityResult,
	type OpportunityResult,
	type ParsedIdea,
	type ResearchResult,
	type SynthesisResult,
	SynthesisResultSchema,
} from "@/graph/schemas";

interface SynthesisInput {
	parsedIdea: ParsedIdea;
	research: ResearchResult;
	critique: CritiqueResult;
	opportunities: OpportunityResult;
	feasibility: FeasibilityResult;
}

export async function runSynthesis(input: SynthesisInput): Promise<SynthesisResult> {
	const response = await getModel(async (llm) => {
		const agent = createAgent({
			model: llm,
			tools: [],
			systemPrompt: SYNTHESIS_PROMPT,
		});

		return agent.invoke({
			messages: [
				{
					role: "user",
					content: JSON.stringify(input, null, 2),
				},
			],
		});
	});

	const lastMessage = response.messages[response.messages.length - 1];
	const content =
		typeof lastMessage?.content === "string"
			? lastMessage.content
			: String(lastMessage?.content);

	return SynthesisResultSchema.parse(JSON.parse(content));
}
