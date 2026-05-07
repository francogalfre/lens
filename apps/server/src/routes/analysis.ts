import { analysisGraph, createLogger, toRunConfig } from "@lens/ai";
import type { Context as HonoContext } from "hono";

type StreamEvent = Record<string, unknown>;

async function emit(
	writer: WritableStreamDefaultWriter<Uint8Array>,
	encoder: TextEncoder,
	data: StreamEvent,
): Promise<void> {
	await writer.write(encoder.encode(`${JSON.stringify(data)}\n`));
}

export async function streamAnalysis(c: HonoContext): Promise<Response> {
	const body = await c.req.json<{ rawIdea?: string }>();

	if (!body.rawIdea?.trim()) {
		return c.json({ error: "rawIdea is required" }, 400);
	}

	const { rawIdea } = body;
	const sessionId = `session-${Date.now()}`;
	const logger = createLogger(toRunConfig(sessionId));
	const encoder = new TextEncoder();
	const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
	const writer = writable.getWriter();

	let closed = false;

	const safeEmit = async (data: StreamEvent): Promise<void> => {
		if (closed) return;
		try {
			await emit(writer, encoder, data);
		} catch {
			closed = true;
		}
	};

	const close = async (): Promise<void> => {
		if (closed) return;
		closed = true;
		try {
			await writer.close();
		} catch {
			// writer already closed by client disconnect
		}
	};

	void (async () => {
		try {
			await safeEmit({ type: "start", sessionId });
			logger.info("Streaming started");

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
						await safeEmit({ type: "nodeStart", agent: custom.agent });
					}
				} else if (mode === "updates") {
					const nodeName = Object.keys(chunk as object)[0];
					if (nodeName) {
						await safeEmit({ type: "agent", agent: nodeName, data: chunk });
					}
				}
			}

			await safeEmit({ type: "complete" });
			logger.info("Streaming completed");
		} catch (error) {
			const msg = error instanceof Error ? error.message : String(error);
			logger.error("Streaming failed", { error: msg });
			await safeEmit({ type: "error", error: msg });
		} finally {
			await close();
		}
	})();

	return new Response(readable, {
		headers: {
			"Content-Type": "application/x-ndjson",
			"Cache-Control": "no-cache",
			"X-Accel-Buffering": "no",
		},
	});
}
