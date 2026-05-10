import { db } from "@lens/db";
import { analyses } from "@lens/db/schema/analyses";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";

export async function listAnalyses(userId: string) {
	return db
		.select({
			id: analyses.id,
			rawIdea: analyses.rawIdea,
			synthesis: analyses.synthesis,
			createdAt: analyses.createdAt,
		})
		.from(analyses)
		.where(eq(analyses.userId, userId))
		.orderBy(desc(analyses.createdAt));
}

export async function getAnalysis(id: string, userId: string) {
	const [analysis] = await db
		.select()
		.from(analyses)
		.where(and(eq(analyses.id, id), eq(analyses.userId, userId)))
		.limit(1);

	if (!analysis) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Analysis not found",
		});
	}

	return analysis;
}
