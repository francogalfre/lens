import { analysisGraph, createLogger, toRunConfig } from "@lens/ai";
import { z } from "zod";
import { publicProcedure, router } from "../index";

export const analysisRouter = router({
	analyze: publicProcedure
		.input(z.object({ rawIdea: z.string() }))
		.mutation(async ({ input }) => {
			const sessionId = `session-${Date.now()}-${crypto.randomUUID()}`;
			const logger = createLogger(toRunConfig(sessionId));
			const updates: Record<string, unknown>[] = [];

			try {
				logger.info("Analysis started");

				const stream = await analysisGraph.stream(
					{ rawIdea: input.rawIdea },
					{
						streamMode: "updates",
						...toRunConfig(sessionId),
					},
				);

				for await (const update of stream) {
					updates.push(update);
				}

				logger.info("Analysis completed");
				return {
					sessionId,
					updates,
				};
			} catch (error) {
				logger.error("Analysis failed", {
					error: error instanceof Error ? error.message : String(error),
				});
				throw error;
			}
		}),
});
