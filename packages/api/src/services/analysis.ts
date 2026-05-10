import { analysisGraph, createLogger, toRunConfig } from "@lens/ai";
import { db } from "@lens/db";
import { analyses } from "@lens/db/schema/analyses";
import { TRPCError } from "@trpc/server";

export async function runAnalysis(userId: string, rawIdea: string) {
	const sessionId = `session-${Date.now()}-${crypto.randomUUID()}-${userId}`;

	const logger = createLogger(toRunConfig(sessionId));
	const updates: Record<string, unknown>[] = [];

	try {
		logger.info("Analysis started");

		const stream = await analysisGraph.stream(
			{ rawIdea },
			{ streamMode: "updates", ...toRunConfig(sessionId) },
		);

		for await (const update of stream) {
			updates.push(update);
		}

		await db.insert(analyses).values({ userId, rawIdea, agentData: updates });

		logger.info("Analysis completed");
		return { sessionId, updates };
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
