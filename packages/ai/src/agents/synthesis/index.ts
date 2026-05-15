import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent } from "langchain";

import { SYNTHESIS_PROMPT } from "@/agents/synthesis/prompt";
import {
	type SynthesisInput,
	type SynthesisResult,
	SynthesisResultSchema,
} from "@/types";
import { createAgentMiddleware } from "@/utils/middleware";
import { createModel } from "@/utils/model";

export type { SynthesisInput };

export async function runSynthesis(
	input: SynthesisInput,
	config?: RunnableConfig,
): Promise<SynthesisResult> {
	const model = createModel(800, 0.5);

	const synthesisAgent = createAgent({
		name: "Synthesis Agent",
		model,
		systemPrompt: SYNTHESIS_PROMPT,
		responseFormat: SynthesisResultSchema,
		tools: [],
		middleware: createAgentMiddleware("Synthesis Agent"),
	});

	const result = await synthesisAgent.invoke(
		{ messages: [{ role: "user", content: JSON.stringify(input, null, 2) }] },
		config,
	);

	return result.structuredResponse;
}
