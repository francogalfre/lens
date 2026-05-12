import { createLogger, toRunConfig } from "@lens/ai";
import {
	checkAndIncrementUsage,
	decrementUsage,
} from "@lens/api/services/subscription";
import { auth } from "@lens/auth";
import type { Context as HonoContext } from "hono";
import { stream } from "hono/streaming";
import { runAnalysisStream } from "@/lib/graph-stream";
import type { StreamEvent } from "@/types/stream";

const MAX_IDEA_LENGTH = 5000;

async function streamAnalysis(
	c: HonoContext,
	userId: string,
): Promise<Response> {
	const body = await c.req.json<{ rawIdea?: string }>();

	if (!body.rawIdea?.trim()) {
		return c.json({ error: "rawIdea is required" }, 400);
	}

	if (body.rawIdea.length > MAX_IDEA_LENGTH) {
		return c.json(
			{ error: `Idea must be under ${MAX_IDEA_LENGTH} characters` },
			400,
		);
	}

	const { rawIdea } = body;

	const logger = createLogger(toRunConfig(userId));

	c.header("Content-Type", "application/x-ndjson");
	c.header("Cache-Control", "no-cache");
	c.header("X-Accel-Buffering", "no");

	return stream(
		c,
		async (writer) => {
			const send = async (event: StreamEvent): Promise<void> => {
				await writer.writeln(JSON.stringify(event));
			};

			try {
				await runAnalysisStream(userId, rawIdea, send);
			} catch (err) {
				await decrementUsage(userId).catch(() => undefined);
				throw err;
			}
		},

		async (error, writer) => {
			logger.error("Streaming failed", { error });
			await decrementUsage(userId).catch(() => undefined);

			await writer.writeln(
				JSON.stringify({
					type: "error",
					error: "Analysis failed. Please try again.",
				}),
			);
		},
	);
}

export async function analysisHandler(c: HonoContext): Promise<Response> {
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
}
