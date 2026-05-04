import { protectedProcedure, publicProcedure, router } from "../index";
import { analysisRouter } from "./analysis";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	analysis: analysisRouter,
});
export type AppRouter = typeof appRouter;
