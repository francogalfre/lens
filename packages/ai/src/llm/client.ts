import { ChatOpenRouter } from "@langchain/openrouter";

import { DEFAULT_LLM_CONFIG, FREE_MODELS } from "@/llm/models";
import { getApiKey, convertMessageToLangChain } from "@/utils";

import type { LLMResponse } from "@/types/llm";
import type {
  InvokeLLMRequest,
  InvokeLLMWithStructureRequest,
  StreamLLMRequest,
} from "@/types/llm-functions";

const isRetryableError = (error: unknown): boolean => {
  if (!(error instanceof Object)) return false;
  const code = (error as { code?: number }).code;
  return code === 404 || code === 429;
};

const createLLM = (model: string): ChatOpenRouter =>
  new ChatOpenRouter({
    model,
    apiKey: getApiKey(),
    temperature: DEFAULT_LLM_CONFIG.temperature,
    maxTokens: DEFAULT_LLM_CONFIG.maxTokens,
  });

async function tryModels<T>(
  fn: (llm: ChatOpenRouter) => Promise<T>,
): Promise<T> {
  let lastError: unknown;

  for (const model of FREE_MODELS) {
    try {
      console.debug(`[LLM] Trying model: ${model}`);
      return await fn(createLLM(model));
    } catch (error) {
      if (isRetryableError(error)) {
        console.debug(`[LLM] Model ${model} failed, trying next...`);
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("[LLM] All models failed");
}

export const invokeLLM = async (
  request: InvokeLLMRequest,
): Promise<LLMResponse> => {
  console.debug(`[LLM] Invoking with ${request.messages.length} messages`);
  const messages = request.messages.map(convertMessageToLangChain);

  const content = await tryModels(async (llm) => {
    const response = await llm.invoke(messages);
    return typeof response.content === "string"
      ? response.content
      : String(response.content);
  });

  console.debug(`[LLM] Response received, length: ${content.length}`);
  return { content };
};

export const invokeLLMWithStructure = async <T>(
  request: InvokeLLMWithStructureRequest<T>,
): Promise<T> => {
  console.debug("[LLM] Invoking with structure schema");
  const messages = request.messages.map(convertMessageToLangChain);

  const result = await tryModels(async (llm) => {
    const structured = llm.withStructuredOutput(request.schema, {
      method: "functionCalling",
    });
    return (await structured.invoke(messages)) as T;
  });

  console.debug("[LLM] Structured response parsed");
  return result;
};

export const streamLLM = async (request: StreamLLMRequest): Promise<string> => {
  console.debug(
    `[LLM] Starting stream with ${request.messages.length} messages`,
  );
  const messages = request.messages.map(convertMessageToLangChain);

  const content = await tryModels(async (llm) => {
    let accumulated = "";
    const stream = await llm.stream(messages);

    for await (const chunk of stream) {
      const text = typeof chunk.content === "string" ? chunk.content : "";
      accumulated += text;
      request.onChunk?.(text);
    }

    return accumulated;
  });

  console.debug(`[LLM] Stream completed, length: ${content.length}`);
  return content;
};
