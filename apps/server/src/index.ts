import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@lens/api/context";
import { appRouter } from "@lens/api/routers";
import { env } from "@lens/env/server";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { analysisRateLimit, authRateLimit } from "@/middleware/rate-limit";
import { analysisHandler } from "@/routes/analysis";
import { authHandler } from "@/routes/auth";
import { polarWebhookRouter } from "@/routes/polar-webhook";

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

app.use("/api/auth/*", authRateLimit);
app.use("/api/analysis/*", analysisRateLimit);

app.route("/", polarWebhookRouter);

app.on(["POST", "GET"], "/api/auth/*", authHandler);
app.post(
	"/api/analysis/stream",
	bodyLimit({ maxSize: 50 * 1024 }),
	analysisHandler,
);

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
