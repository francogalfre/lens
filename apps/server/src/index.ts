import { analysisGraph, createLogger, toRunConfig } from "@lens/ai";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@lens/api/context";
import { appRouter } from "@lens/api/routers/index";
import { auth } from "@lens/auth";
import { env } from "@lens/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

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
	const { rawIdea } = await c.req.json<{ rawIdea: string }>();

	if (!rawIdea) {
		return c.json({ error: "rawIdea is required" }, 400);
	}

	const sessionId = `session-${Date.now()}`;
	const logger_ = createLogger(toRunConfig(sessionId));

	const lines: string[] = [];
	lines.push(JSON.stringify({ type: "start", sessionId }));

	try {
		logger_.info("Streaming started");

		const analysisStream = await analysisGraph.stream(
			{ rawIdea },
			{
				streamMode: "updates",
				...toRunConfig(sessionId),
			},
		);

		for await (const update of analysisStream) {
			const nodeName = Object.keys(update)[0];
			if (nodeName) {
				lines.push(JSON.stringify({ type: "agent", agent: nodeName, data: update }));
			}
		}

		lines.push(JSON.stringify({ type: "complete" }));
		logger_.info("Streaming completed");
	} catch (error) {
		logger_.error("Streaming failed", {
			error: error instanceof Error ? error.message : String(error),
		});
		lines.push(
			JSON.stringify({
				type: "error",
				error: error instanceof Error ? error.message : "Unknown error",
			}),
		);
	}

	return c.text(lines.join("\n"), {
		headers: {
			"Content-Type": "application/x-ndjson",
		},
	});
});

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) => {
			return createContext({ context });
		},
	}),
);

app.get("/", (c) => {
	return c.text("OK");
});

export default app;
