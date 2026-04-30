export type MessageRole = "user" | "assistant" | "system";

export interface Message {
	role: MessageRole;
	content: string;
}

export interface LLMResponse {
	content: string;
}

export interface LLMOptions {
	temperature?: number;
	maxTokens?: number;
}
