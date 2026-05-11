import { TRPCError } from "@trpc/server";

import { analyzeInputSchema } from "@/schemas/analysis";
import { runAnalysis } from "@/services/analysis";
import { checkAndIncrementUsage } from "@/services/subscription";
import { protectedProcedure, router } from "@/trpc";

export const analysisRouter = router({
	analyze: protectedProcedure
		.input(analyzeInputSchema)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;

			const usage = await checkAndIncrementUsage(userId);
			if (!usage.allowed) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Daily analysis limit reached. Upgrade to premium for more.",
				});
			}

			return runAnalysis(userId, input.rawIdea);
		}),
});
