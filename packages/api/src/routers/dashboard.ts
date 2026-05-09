import { db } from "@lens/db";
import { analyses } from "@lens/db/schema/analyses";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "../index";

export const dashboardRouter = router({
	listAnalyses: protectedProcedure.query(async ({ ctx }) => {
		return db
			.select({
				id: analyses.id,
				rawIdea: analyses.rawIdea,
				synthesis: analyses.synthesis,
				createdAt: analyses.createdAt,
			})
			.from(analyses)
			.where(eq(analyses.userId, ctx.session.user.id))
			.orderBy(desc(analyses.createdAt));
	}),

	getAnalysis: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const result = await db
				.select()
				.from(analyses)
				.where(
					and(
						eq(analyses.id, input.id),
						eq(analyses.userId, ctx.session.user.id),
					),
				)
				.limit(1);

			if (!result[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Analysis not found",
				});
			}

			return result[0];
		}),
});
