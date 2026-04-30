import { ChatOpenRouter } from "@langchain/openrouter";
import { DEFAULT_LLM_CONFIG, FREE_MODELS } from "@/llm/models";
import { getApiKey } from "./apiKey";

const isRetryableError = (error: unknown): boolean => {
	if (!(error instanceof Object)) return false;
	const code = (error as { code?: number }).code;
	return code === 404 || code === 429;
};

export async function getModel<T>(
	fn: (llm: ChatOpenRouter) => Promise<T>,
): Promise<T> {
	let lastError: unknown;

	for (const model of FREE_MODELS) {
		try {
			console.debug(`[Model] Trying: ${model}`);
			const llm = new ChatOpenRouter({
				model,
				apiKey: getApiKey(),
				temperature: DEFAULT_LLM_CONFIG.temperature,
				maxTokens: DEFAULT_LLM_CONFIG.maxTokens,
			});
			return await fn(llm);
		} catch (error) {
			if (isRetryableError(error)) {
				console.debug(`[Model] ${model} failed, trying next...`);
				lastError = error;
				continue;
			}
			throw error;
		}
	}

	throw lastError ?? new Error("[Model] All models failed");
}
