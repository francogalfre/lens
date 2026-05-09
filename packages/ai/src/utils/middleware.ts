import { createMiddleware } from "langchain";

export const createLoggingMiddleware = (agentName: string) =>
	createMiddleware({
		name: "AgentsLogMiddleware",
		wrapToolCall: async (request, handler) => {
			console.log(
				`[${agentName}] -> ${request.toolCall.name}`,
				JSON.stringify(request.toolCall.args),
			);

			try {
				const result = handler(request);
				console.log("Tool completed successfully");

				return result;
			} catch (e) {
				console.log(`Tool failed: ${e}`);
				throw e;
			}
		},
	});
