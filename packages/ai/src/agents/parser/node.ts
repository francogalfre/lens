import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import { runParser } from "@/agents/parser/index";
import type { State } from "@/graph";

export const parserNode = async (state: State, config: RunnableConfig) => {
	getWriter()?.({ type: "nodeStart", agent: "parser_agent" });

	const result = await runParser(state.rawIdea, config);

	if ("validationError" in result) {
		return {
			validationError: result.validationError,
			language: result.language,
		};
	}

	return {
		parsedIdea: result,
		language: result.language,
		completedAgents: ["parser"],
	};
};
