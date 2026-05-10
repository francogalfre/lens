import { z } from "zod";

import { getAnalysis, listAnalyses } from "@/services/dashboard";
import { protectedProcedure, router } from "@/trpc";

export const dashboardRouter = router({
	listAnalyses: protectedProcedure.query(async ({ ctx }) => {
		return listAnalyses(ctx.session.user.id);
	}),

	getAnalysis: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			return getAnalysis(input.id, ctx.session.user.id);
		}),
});
