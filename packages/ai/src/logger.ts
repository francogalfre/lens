import type { RunnableConfig } from "@langchain/core/runnables";

export interface Logger {
	info: (message: string, data?: unknown) => void;
	warn: (message: string, data?: unknown) => void;
	error: (message: string, data?: unknown) => void;
}

export function createLogger(config?: RunnableConfig): Logger {
	const sessionId = config?.configurable?.sessionId as string | undefined;
	const prefix = sessionId ? `[${sessionId.slice(0, 8)}]` : "[local]";

	return {
		info: (message: string, data?: unknown) => {
			console.log(`${prefix} ${message}`, data ? JSON.stringify(data) : "");
		},
		warn: (message: string, data?: unknown) => {
			console.warn(`${prefix} ⚠ ${message}`, data ? JSON.stringify(data) : "");
		},
		error: (message: string, data?: unknown) => {
			console.error(`${prefix} ✘ ${message}`, data ? JSON.stringify(data) : "");
		},
	};
}
