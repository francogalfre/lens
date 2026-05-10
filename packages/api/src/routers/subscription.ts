import { db } from "@lens/db";
import { dailyUsage } from "@lens/db/schema/daily_usage";
import { subscriptions } from "@lens/db/schema/subscriptions";
import { env } from "@lens/env/server";
import { Polar } from "@polar-sh/sdk";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import { protectedProcedure, router } from "../index";

const FREE_LIMIT = 1;
const PREMIUM_LIMIT = 3;

export const subscriptionRouter = router({
	getStatus: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;
		const date = new Date().toISOString().slice(0, 10);

		const [activeSub, todayUsage] = await Promise.all([
			db
				.select({
					id: subscriptions.id,
					status: subscriptions.status,
					currency: subscriptions.currency,
					currentPeriodEnd: subscriptions.currentPeriodEnd,
				})
				.from(subscriptions)
				.where(
					and(
						eq(subscriptions.userId, userId),
						eq(subscriptions.status, "active"),
					),
				)
				.limit(1),
			db
				.select({ count: dailyUsage.count })
				.from(dailyUsage)
				.where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, date)))
				.limit(1),
		]);

		const isPremium = activeSub.length > 0;
		const limit = isPremium ? PREMIUM_LIMIT : FREE_LIMIT;
		const usedToday = todayUsage[0]?.count ?? 0;

		return {
			plan: isPremium ? ("premium" as const) : ("free" as const),
			usedToday,
			limit,
			remaining: Math.max(0, limit - usedToday),
			subscription: activeSub[0] ?? null,
		};
	}),

	createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
		const polar = new Polar({
			accessToken: env.POLAR_ACCESS_TOKEN,
			server: env.POLAR_ENV,
		});

		try {
			const checkout = await polar.checkouts.create({
				products: [env.POLAR_PRODUCT_ID],
				customerEmail: ctx.session.user.email,
				successUrl: `${env.CORS_ORIGIN}/dashboard?upgraded=true`,
			});

			return { checkoutUrl: checkout.url };
		} catch {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create checkout session",
			});
		}
	}),
});
