import { createMiddleware } from "langchain";

export const createAgentMiddleware = (agentName: string) => [
	createMiddleware({
		name: "AgentsLogMiddleware",
		wrapToolCall: async (request, handler) => {
			console.log(
				`[${agentName}] -> ${request.toolCall.name}`,
				JSON.stringify(request.toolCall.args),
			);

			try {
				const result = await handler(request);
				console.log(`[${agentName}] tool ${request.toolCall.name} ok`);
				return result;
			} catch (e) {
				console.warn(`[${agentName}] tool ${request.toolCall.name} failed:`, e);
				throw e;
			}
		},
	}),

	createMiddleware({
		name: "AgentsErrorBoundaryMiddleware",
		wrapModelCall: async (request, handler) => {
			try {
				return await handler(request);
			} catch (error) {
				console.warn(
					`[${agentName}] model call failed:`,
					error instanceof Error ? error.message : String(error),
				);
				throw error;
			}
		},
	}),
];
