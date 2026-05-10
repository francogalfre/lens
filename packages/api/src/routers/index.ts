import { analysisRouter } from "@/routers/analysis";
import { authRouter } from "@/routers/auth";
import { dashboardRouter } from "@/routers/dashboard";
import { subscriptionRouter } from "@/routers/subscription";
import { router } from "@/trpc";

export const appRouter = router({
	analysis: analysisRouter,
	auth: authRouter,
	dashboard: dashboardRouter,
	subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
