import { db } from "@lens/db";
import { user } from "@lens/db/schema/auth";
import { dailyUsage } from "@lens/db/schema/daily_usage";
import { subscriptions } from "@lens/db/schema/subscriptions";
import { env } from "@lens/env/server";
import { Polar } from "@polar-sh/sdk";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import { PLAN_LIMITS } from "@/config";
import { subscriptionEventSchema } from "@/types/webhook";

export type UsageCheckResult = {
	allowed: boolean;
	count: number;
	limit: number;
};

export async function checkAndIncrementUsage(
	userId: string,
): Promise<UsageCheckResult> {
	const [activeSub] = await db
		.select({ id: subscriptions.id })
		.from(subscriptions)
		.where(
			and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")),
		)
		.limit(1);

	const limit = activeSub ? PLAN_LIMITS.premium : PLAN_LIMITS.free;
	const date = new Date().toISOString().slice(0, 10);

	return db.transaction(async (tx) => {
		const inserted = await tx
			.insert(dailyUsage)
			.values({ userId, date, count: 1 })
			.onConflictDoNothing()
			.returning({ count: dailyUsage.count });

		if (inserted[0]) {
			const { count } = inserted[0];
			return { allowed: count <= limit, count, limit };
		}

		const [current] = await tx
			.select({ count: dailyUsage.count })
			.from(dailyUsage)
			.where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, date)))
			.for("update");

		const currentCount = current?.count ?? 0;
		if (currentCount >= limit)
			return { allowed: false, count: currentCount, limit };

		await tx
			.update(dailyUsage)
			.set({ count: currentCount + 1 })
			.where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, date)));

		return { allowed: true, count: currentCount + 1, limit };
	});
}

export async function decrementUsage(userId: string): Promise<void> {
	const date = new Date().toISOString().slice(0, 10);
	await db.transaction(async (tx) => {
		const [current] = await tx
			.select({ count: dailyUsage.count })
			.from(dailyUsage)
			.where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, date)))
			.for("update");
		const c = current?.count ?? 0;
		if (c <= 0) return;
		await tx
			.update(dailyUsage)
			.set({ count: c - 1 })
			.where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, date)));
	});
}

export async function getSubscriptionStatus(userId: string) {
	const date = new Date().toISOString().slice(0, 10);

	const [activeSub, todayUsage] = await Promise.all([
		db
			.select({
				id: subscriptions.id,
				status: subscriptions.status,
				currency: subscriptions.currency,
				currentPeriodEnd: subscriptions.currentPeriodEnd,
				cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
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
	const limit = isPremium ? PLAN_LIMITS.premium : PLAN_LIMITS.free;
	const usedToday = todayUsage[0]?.count ?? 0;
	const sub = activeSub[0] ?? null;

	return {
		plan: isPremium ? ("premium" as const) : ("free" as const),
		usedToday,
		limit,
		remaining: Math.max(0, limit - usedToday),
		subscription: sub,
		cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
		currentPeriodEnd: sub?.currentPeriodEnd ?? null,
	};
}

export async function upsertSubscription(payload: unknown): Promise<void> {
	const parsed = subscriptionEventSchema.safeParse(payload);
	if (!parsed.success) {
		console.warn("[subscription] webhook payload failed validation", {
			error: parsed.error.message,
		});
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid webhook payload",
		});
	}
	const { data: sub } = parsed.data;
	const { customer } = sub;

	let userId: string | null = customer.externalId ?? null;

	if (!userId && customer.email) {
		const rows = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, customer.email))
			.limit(1);
		userId = rows[0]?.id ?? null;
	}

	if (!userId) {
		console.warn("[subscription] webhook received but no matching user found", {
			subscriptionId: sub.id,
		});
		return;
	}

	await db
		.insert(subscriptions)
		.values({
			id: sub.id,
			userId,
			polarCustomerId: customer.id,
			status: sub.status,
			productId: sub.productId,
			currency: sub.currency,
			currentPeriodEnd: sub.currentPeriodEnd,
			cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
		})
		.onConflictDoUpdate({
			target: subscriptions.id,
			set: {
				status: sub.status,
				productId: sub.productId,
				currentPeriodEnd: sub.currentPeriodEnd,
				cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
				updatedAt: new Date(),
			},
		});
}

export async function cancelSubscription(userId: string) {
	const [sub] = await db
		.select({
			id: subscriptions.id,
			cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
		})
		.from(subscriptions)
		.where(
			and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")),
		)
		.limit(1);

	if (!sub) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "No active subscription to cancel",
		});
	}

	if (sub.cancelAtPeriodEnd) {
		return { success: true, alreadyCancelled: true };
	}

	const polar = new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		server: env.POLAR_ENV,
	});

	try {
		await polar.subscriptions.update({
			id: sub.id,
			subscriptionUpdate: { cancelAtPeriodEnd: true },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		const isAlreadyCancelled = message.includes("AlreadyCanceledSubscription");

		if (!isAlreadyCancelled) {
			console.error("[subscription] cancel failed", { error: message });
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to cancel subscription",
			});
		}
	}

	await db
		.update(subscriptions)
		.set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
		.where(eq(subscriptions.id, sub.id));

	return { success: true, alreadyCancelled: false };
}

export async function createCheckout(userEmail: string) {
	const polar = new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		server: env.POLAR_ENV,
	});

	try {
		const checkout = await polar.checkouts.create({
			products: [env.POLAR_PRODUCT_ID],
			customerEmail: userEmail,
			successUrl: `${env.CORS_ORIGIN}/upgrade/success?checkout_id={CHECKOUT_ID}`,
		});

		return { checkoutUrl: checkout.url };
	} catch (error) {
		console.error("[checkout] Polar checkout creation failed", {
			error: error instanceof Error ? error.message : "Unknown error",
		});
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to create checkout session",
		});
	}
}
