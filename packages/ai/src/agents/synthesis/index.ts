import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";
import { SYNTHESIS_PROMPT } from "./prompt";
import {
	type CritiqueResult,
	type FeasibilityResult,
	type OpportunityResult,
	type ParsedIdea,
	type ResearchResult,
	type SynthesisResult,
	SynthesisResultSchema,
} from "../../graph/schemas";
import { createLogger } from "../../logger";
import { getModel } from "../../utils";

interface SynthesisInput {
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
	const logger = createLogger(config);

	try {
		logger.info("Starting synthesis");

		const response = await getModel(async (llm) => {
			const agent = createAgent({
				model: llm,
				tools: [],
				systemPrompt: SYNTHESIS_PROMPT,
			});

			return agent.invoke(
				{
					messages: [{ role: "user", content: JSON.stringify(input, null, 2) }],
				},
				config,
			);
		});

		const lastMessage = response.messages[response.messages.length - 1];
		const content =
			typeof lastMessage?.content === "string"
				? lastMessage.content
				: String(lastMessage?.content);

		const result = SynthesisResultSchema.parse(JSON.parse(content));
		logger.info("Synthesis completed", { score: result.overallScore });

		return result;
	} catch (error) {
		logger.error("Synthesis failed", {
			error: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}
