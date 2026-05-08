import type { LLMResponse } from "../types/llm";
import type {
  InvokeLLMRequest,
  InvokeLLMWithStructureRequest,
  StreamLLMRequest,
} from "../types/llm-functions";
import { convertMessageToLangChain, getModel } from "../utils";

export const invokeLLM = async (
  request: InvokeLLMRequest,
): Promise<LLMResponse> => {
  console.debug(`[LLM] Invoking with ${request.messages.length} messages`);
  const messages = request.messages.map(convertMessageToLangChain);

  const content = await getModel(async (llm) => {
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

  const result = await getModel(async (llm) => {
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

  const content = await getModel(async (llm) => {
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
