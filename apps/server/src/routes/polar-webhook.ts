import { db } from "@lens/db";
import { user } from "@lens/db/schema/auth";
import { subscriptions } from "@lens/db/schema/subscriptions";
import { env } from "@lens/env/server";
import { Webhooks } from "@polar-sh/hono";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono();

type SubscriptionEvent = {
	data: {
		id: string;
		status: string;
		currency: string;
		productId: string;
		currentPeriodEnd: Date;
		customer: {
			id: string;
			email?: string | null;
			externalId?: string | null;
		};
	};
};

async function upsertSubscription(payload: SubscriptionEvent) {
	const sub = payload.data;
	const customer = sub.customer;

	console.log("[polar-webhook] event received", {
		subscriptionId: sub.id,
		status: sub.status,
		customerId: customer.id,
		externalId: customer.externalId,
		email: customer.email,
	});

	let userId: string | null = customer.externalId ?? null;

	if (!userId && customer.email) {
		const rows = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, customer.email))
			.limit(1);
		userId = rows[0]?.id ?? null;
		console.log("[polar-webhook] email lookup result", {
			email: customer.email,
			userId,
		});
	}

	if (!userId) {
		console.warn("[polar-webhook] no matching user found, skipping");
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
		})
		.onConflictDoUpdate({
			target: subscriptions.id,
			set: {
				status: sub.status,
				productId: sub.productId,
				currentPeriodEnd: sub.currentPeriodEnd,
				updatedAt: new Date(),
			},
		});

	console.log("[polar-webhook] subscription upserted", {
		subscriptionId: sub.id,
		userId,
		status: sub.status,
	});
}

app.post(
	"/api/webhooks/polar",
	Webhooks({
		webhookSecret: env.POLAR_WEBHOOK_SECRET,
		onSubscriptionCreated: upsertSubscription,
		onSubscriptionUpdated: upsertSubscription,
		onSubscriptionActive: upsertSubscription,
		onSubscriptionCanceled: upsertSubscription,
		onSubscriptionRevoked: upsertSubscription,
		onSubscriptionUncanceled: upsertSubscription,
	}),
);

export { app as polarWebhookRouter };
