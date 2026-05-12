import {
	cancelSubscription,
	createCheckout,
	getSubscriptionStatus,
} from "@/services/subscription";
import { protectedProcedure, router } from "@/trpc";

export const subscriptionRouter = router({
	getStatus: protectedProcedure.query(async ({ ctx }) => {
		return getSubscriptionStatus(ctx.session.user.id);
	}),

	createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
		return createCheckout(ctx.session.user.email);
	}),

	cancel: protectedProcedure.mutation(async ({ ctx }) => {
		return cancelSubscription(ctx.session.user.id);
	}),
});
