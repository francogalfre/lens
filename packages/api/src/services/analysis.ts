import { analysisGraph, createLogger, toRunConfig } from "@lens/ai";
import { db } from "@lens/db";
import { analyses } from "@lens/db/schema/analyses";
import { TRPCError } from "@trpc/server";

export async function saveAnalysis(params: {
	userId: string;
	rawIdea: string;
	parsedIdea: unknown;
	synthesis: unknown | null;
	agentData: Record<string, unknown>;
}): Promise<void> {
	await db.insert(analyses).values(params);
}

export async function runAnalysis(userId: string, rawIdea: string) {
	const sessionId = `session-${Date.now()}-${crypto.randomUUID()}-${userId}`;
	const logger = createLogger(toRunConfig(sessionId));

	try {
		const graphStream = await analysisGraph.stream(
			{ rawIdea },
			{ streamMode: "updates", ...toRunConfig(sessionId) },
		);

		const agentData: Record<string, unknown> = {};
		let parsedIdea: unknown = null;
		let synthesis: unknown = null;

		for await (const update of graphStream) {
			const nodeName = Object.keys(update as object)[0];

			if (!nodeName) continue;
			const nodeData = (update as Record<string, Record<string, unknown>>)[
				nodeName
			];

			agentData[nodeName] = nodeData;

			if (nodeName === "parser_agent")
				parsedIdea = nodeData?.parsedIdea ?? null;
			if (nodeName === "synthesis_agent")
				synthesis = nodeData?.synthesis ?? null;
		}

		if (parsedIdea && synthesis) {
			await saveAnalysis({ userId, rawIdea, parsedIdea, synthesis, agentData });
		}

		return { sessionId, agentData };
	} catch (error) {
		logger.error("Analysis failed", {
			error: error instanceof Error ? error.message : String(error),
		});
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Analysis failed",
			cause: error,
		});
	}
}
