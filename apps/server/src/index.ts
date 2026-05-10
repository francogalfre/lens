import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@lens/api/context";
import { appRouter } from "@lens/api/routers/index";
import { auth } from "@lens/auth";
import { env } from "@lens/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { rateLimiter } from "hono-rate-limiter";

import { checkAndIncrementUsage } from "./lib/check-usage";
import { streamAnalysis } from "./routes/analysis";
import { polarWebhookRouter } from "./routes/polar-webhook";

const app = new Hono();

app.use(logger());
app.use(secureHeaders());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.use(
	"/api/auth/*",
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		limit: 10,
		keyGenerator: (c) =>
			c.req.header("x-forwarded-for") ??
			c.req.header("cf-connecting-ip") ??
			"unknown",
	}),
);

app.use(
	"/api/analysis/*",
	rateLimiter({
		windowMs: 10 * 60 * 1000,
		limit: 5,
		keyGenerator: (c) =>
			c.req.header("x-forwarded-for") ??
			c.req.header("cf-connecting-ip") ??
			"unknown",
	}),
);

app.route("/", polarWebhookRouter);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.post("/api/analysis/stream", async (c) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const usage = await checkAndIncrementUsage(session.user.id);
	if (!usage.allowed) {
		return c.json(
			{
				error: "Daily limit reached",
				code: "LIMIT_REACHED",
				usedToday: usage.count,
				limit: usage.limit,
			},
			429,
		);
	}

	return streamAnalysis(c, session.user.id);
});

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) => createContext({ context }),
		responseMeta: ({ ctx }) => {
			const headers = new Headers();
			const context = ctx as { responseHeaders?: Headers } | undefined;
			context?.responseHeaders?.forEach((value, key) => {
				headers.append(key, value);
			});
			return { headers };
		},
	}),
);

app.get("/", (c) => c.text("OK"));

export default {
	fetch: app.fetch.bind(app),
	idleTimeout: 0,
};
