import { trpcServer } from "@hono/trpc-server";
import { analysisGraph, createLogger, toRunConfig } from "@lens/ai";
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
	const encoder = new TextEncoder();
	const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
	const writer = writable.getWriter();

	let closed = false;

	const emit = async (data: Record<string, unknown>) => {
		if (closed) return;
		try {
			await writer.write(encoder.encode(`${JSON.stringify(data)}\n`));
		} catch {
			closed = true;
		}
	};

	const closeWriter = async () => {
		if (closed) return;
		closed = true;
		try {
			await writer.close();
		} catch {
			// already closed by the client disconnect or timeout
		}
	};

	void (async () => {
		try {
			await emit({ type: "start", sessionId });
			logger_.info("Streaming started");

			const analysisStream = await analysisGraph.stream(
				{ rawIdea },
				{
					streamMode: ["custom", "updates"] as unknown as "updates",
					...toRunConfig(sessionId),
				},
			);

			for await (const event of analysisStream as unknown as AsyncIterable<
				[string, unknown]
			>) {
				if (closed) break;
				const [mode, chunk] = event;

				if (mode === "custom") {
					const custom = chunk as { type: string; agent: string };
					if (custom?.type === "nodeStart") {
						await emit({ type: "nodeStart", agent: custom.agent });
					}
				} else if (mode === "updates") {
					const nodeName = Object.keys(chunk as object)[0];
					if (nodeName) {
						await emit({ type: "agent", agent: nodeName, data: chunk });
					}
				}
			}

			await emit({ type: "complete" });
			logger_.info("Streaming completed");
		} catch (error) {
			const msg = error instanceof Error ? error.message : String(error);
			logger_.error("Streaming failed", { error: msg });
			await emit({ type: "error", error: msg });
		} finally {
			await closeWriter();
		}
	})();

	return new Response(readable, {
		headers: {
			"Content-Type": "application/x-ndjson",
			"Cache-Control": "no-cache",
			"X-Accel-Buffering": "no",
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

// idleTimeout: 0 disables Bun's 10s idle connection timeout, required for long-running streams
export default {
	fetch: app.fetch.bind(app),
	idleTimeout: 0,
};
