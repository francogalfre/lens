import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import type { State } from "@/graph";
import { runParser } from "./index";

export const parserNode = async (state: State, config: RunnableConfig) => {
	getWriter()?.({ type: "nodeStart", agent: "parser_agent" });

	const result = await runParser(state.rawIdea, config);

	if ("validationError" in result) {
		return { validationError: result.validationError };
	}

	return {
		parsedIdea: result,
		completedAgents: ["parser"],
	};
};
