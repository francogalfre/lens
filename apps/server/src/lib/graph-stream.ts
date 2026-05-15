import { analysisGraph, toRunConfig } from "@lens/ai";

import { createAnalysis, patchAnalysis } from "@lens/api/services/analysis";
import type { StreamEvent } from "@/types/stream";

export async function runAnalysisStream(
	userId: string,
	rawIdea: string,
	send: (event: StreamEvent) => Promise<void>,
): Promise<void> {
	await send({ type: "start", sessionId: userId });

	const graphStream = await analysisGraph.stream(
		{ rawIdea },
		{
			streamMode: ["custom", "updates"] as ("custom" | "updates")[],
			...toRunConfig(userId),
			recursionLimit: 50,
		},
	);

	let analysisId: string | null = null;

	for await (const [mode, chunk] of graphStream as unknown as AsyncIterable<
		[string, unknown]
	>) {
		if (mode === "custom") {
			const custom = chunk as { type?: string; agent?: string };

			if (custom?.type === "nodeStart")
				await send({ type: "nodeStart", agent: custom.agent });
			continue;
		}

		if (mode !== "updates") continue;

		const nodeName = Object.keys(chunk as object)[0];
		if (!nodeName) continue;

		const nodeData = (chunk as Record<string, Record<string, unknown>>)[
			nodeName
		];

		await send({ type: "agent", agent: nodeName, data: chunk });

		if (nodeName === "parser_agent") {
			if (nodeData?.validationError) continue;
			if (!nodeData?.parsedIdea) continue;
			analysisId = await createAnalysis({ userId, rawIdea });
			await patchAnalysis(analysisId, {
				parsedIdea: nodeData.parsedIdea,
				agentData: { name: nodeName, data: nodeData },
			});
			continue;
		}

		if (!analysisId) continue;

		const patch: Parameters<typeof patchAnalysis>[1] = {
			agentData: { name: nodeName, data: nodeData },
		};

		if (nodeName === "synthesis_agent" && nodeData?.synthesis) {
			patch.synthesis = nodeData.synthesis;
		}

		await patchAnalysis(analysisId, patch).catch((error) => {
			console.warn("[graph-stream] patchAnalysis failed:", error);
		});
	}

	await send({ type: "complete" });
}
