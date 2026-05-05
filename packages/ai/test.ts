import { CallbackHandler } from "@langfuse/langchain";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { analysisGraph, toRunConfig } from "./src/index";

const sdk = new NodeSDK({
	spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();

const sessionId = `test-session-${Date.now()}`;
const langfuseHandler = new CallbackHandler({
	sessionId,
	tags: ["analysis", "test"],
});

console.log(`[${sessionId.slice(0, 8)}...] Starting analysis\n`);

const stream = await analysisGraph.stream(
	{
		rawIdea:
			"Una app que usa IA para resumir reuniones de Zoom automáticamente",
	},
	{
		streamMode: "updates",
		callbacks: [langfuseHandler],
		...toRunConfig(sessionId),
	},
);

for await (const event of stream) {
	const nodeName = Object.keys(event)[0];
	if (nodeName) {
		console.log(`✓ ${nodeName}`);
	}
}

console.log(`\n[${sessionId.slice(0, 8)}...] Complete`);
