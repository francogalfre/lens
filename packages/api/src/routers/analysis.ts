import { analyzeInputSchema } from "@/schemas/analysis";
import { runAnalysis } from "@/services/analysis";
import { claimUsageSlot } from "@/services/subscription";
import { protectedProcedure, router } from "@/trpc";

export const analysisRouter = router({
	analyze: protectedProcedure
		.input(analyzeInputSchema)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;
			await claimUsageSlot(userId);
			return runAnalysis(userId, input.rawIdea);
		}),
});
