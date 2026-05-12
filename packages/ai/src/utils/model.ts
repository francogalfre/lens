import { ChatOpenRouter } from "@langchain/openrouter";
import { env } from "@lens/env/server";

import { getApiKey } from "@/utils/api-key";

export const createModel = (maxTokens = 800) =>
	new ChatOpenRouter({
		model: env.OPENROUTER_MODEL,
		apiKey: getApiKey(),
		temperature: 0,
		maxTokens,
	});
