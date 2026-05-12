import { ChatOpenRouter } from "@langchain/openrouter";
import { getApiKey } from "@/utils/api-key";

const MODEL_NAME = process.env.OPENROUTER_MODEL ?? "openai/gpt-oss-120b:free";

export const createModel = (maxTokens = 800) =>
	new ChatOpenRouter({
		model: MODEL_NAME,
		apiKey: getApiKey(),
		temperature: 0,
		maxTokens,
	});
