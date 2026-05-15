import {
	handleSubscriptionCreated,
	upsertSubscription,
} from "@lens/api/services/subscription";
import { env } from "@lens/env/server";
import { Webhooks } from "@polar-sh/hono";
import { Hono } from "hono";

const app = new Hono();

app.post(
	"/api/webhooks/polar",
	Webhooks({
		webhookSecret: env.POLAR_WEBHOOK_SECRET,
		onSubscriptionCreated: handleSubscriptionCreated,
		onSubscriptionUpdated: upsertSubscription,
		onSubscriptionActive: upsertSubscription,
		onSubscriptionCanceled: upsertSubscription,
		onSubscriptionRevoked: upsertSubscription,
		onSubscriptionUncanceled: upsertSubscription,
	}),
);

export { app as polarWebhookRouter };
