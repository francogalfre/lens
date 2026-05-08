import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@lens/api/context";
import { appRouter } from "@lens/api/routers/index";
import { auth } from "@lens/auth";
import { env } from "@lens/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { streamAnalysis } from "./routes/analysis";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.post("/api/analysis/stream", async (c) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
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

// idleTimeout: 0 disables Bun's 10s idle connection timeout, required for long-running streams
export default {
	fetch: app.fetch.bind(app),
	idleTimeout: 0,
};
