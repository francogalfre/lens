import { protectedProcedure, publicProcedure, router } from "../index";
import { analysisRouter } from "./analysis";
import { authRouter } from "./auth";
import { dashboardRouter } from "./dashboard";
import { subscriptionRouter } from "./subscription";

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
	dashboard: dashboardRouter,
	subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
