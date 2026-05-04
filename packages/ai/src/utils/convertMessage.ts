import {
	AIMessage,
	HumanMessage,
	SystemMessage,
} from "@langchain/core/messages";
import type { Message } from "@/llm";

export const convertMessageToLangChain = (message: Message) => {
	if (message.role === "system") return new SystemMessage(message.content);
	if (message.role === "assistant") return new AIMessage(message.content);

	return new HumanMessage(message.content);
};
