import type { z } from "zod";
import type { LLMOptions, Message } from "./llm";

export interface InvokeLLMRequest {
	messages: Message[];
	options?: LLMOptions;
}

export interface InvokeLLMWithStructureRequest<T = unknown> {
	messages: Message[];
	schema: z.ZodSchema<T>;
	options?: LLMOptions;
}

export interface StreamLLMRequest {
	messages: Message[];
	onChunk?: (chunk: string) => void;
	options?: LLMOptions;
}
