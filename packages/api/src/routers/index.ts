import { protectedProcedure, publicProcedure, router } from "../index";
import { analysisRouter } from "./analysis";
import { authRouter } from "./auth";

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
	auth: authRouter,
});

export type AppRouter = typeof appRouter;
