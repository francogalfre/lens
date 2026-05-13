import { analysisGraph, toRunConfig } from "@lens/ai";

import { saveAnalysis } from "@lens/api/services/analysis";
import type { AnalysisResult, StreamEvent } from "@/types/stream";

function collectNodeUpdate(
	chunk: unknown,
	nodeName: string,
	result: AnalysisResult,
): void {
	const update = (chunk as Record<string, Record<string, unknown>>)[nodeName];

	result.agentData[nodeName] = update;

	if (nodeName === "parser_agent")
		result.parsedIdea = update?.parsedIdea ?? null;

	if (nodeName === "synthesis_agent")
		result.synthesis = update?.synthesis ?? null;
}

export async function runAnalysisStream(
	userId: string,
	rawIdea: string,
	send: (event: StreamEvent) => Promise<void>,
): Promise<void> {
	const result: AnalysisResult = {
		parsedIdea: null,
		synthesis: null,
		agentData: {},
	};

	await send({ type: "start", sessionId: userId });

	const graphStream = await analysisGraph.stream(
		{ rawIdea },
		{
			streamMode: ["custom", "updates"] as ("custom" | "updates")[],
			...toRunConfig(userId),
		},
	);

	for await (const [mode, chunk] of graphStream as unknown as AsyncIterable<
		[string, unknown]
	>) {
		if (mode === "custom") {
			const custom = chunk as { type?: string; agent?: string };

			if (custom?.type === "nodeStart")
				await send({ type: "nodeStart", agent: custom.agent });
		} else if (mode === "updates") {
			const nodeName = Object.keys(chunk as object)[0];

			if (!nodeName) continue;

			await send({ type: "agent", agent: nodeName, data: chunk });

			collectNodeUpdate(chunk, nodeName, result);
		}
	}

	await send({ type: "complete" });

	if (result.parsedIdea) {
		await saveAnalysis({
			userId,
			rawIdea,
			parsedIdea: result.parsedIdea,
			synthesis: result.synthesis ?? null,
			agentData: result.agentData,
		});
	}
}
