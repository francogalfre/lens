import { Serper } from "@langchain/community/tools/serper";
import type { RunnableConfig } from "@langchain/core/runnables";

import { type ResearchResult, ResearchResultSchema } from "@/graph/schemas";
import { createModel } from "@/utils/model";
import { RESEARCHER_PROMPT } from "./prompt";

const searchTool = new Serper(process.env.SERPER_API_KEY);

export async function runResearcher(
	idea: string,
	config?: RunnableConfig,
): Promise<ResearchResult> {
	const queries = [
		`${idea} competitors alternatives`,
		`${idea} market size trends 2024`,
		`${idea} startup solutions demand`,
	];

	const results = await Promise.allSettled(
		queries.map((q) => searchTool.invoke(q)),
	);

	const context = results
		.map(
			(r, i) =>
				`Query: ${queries[i]}\n${r.status === "fulfilled" ? r.value : "No results"}`,
		)
		.join("\n\n---\n\n");

	return createModel(1200)
		.withStructuredOutput(ResearchResultSchema)
		.invoke(
			[
				{ role: "system", content: RESEARCHER_PROMPT },
				{
					role: "user",
					content: `Idea: ${idea}\n\nSearch results:\n\n${context}`,
				},
			],
			config,
		);
}
