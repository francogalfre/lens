import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import type { State } from "@/graph";
import { runCritic } from "./index";

export const criticNode = async (state: State, config: RunnableConfig) => {
	if (state.validationError) return {};
	getWriter()?.({ type: "nodeStart", agent: "critic_agent" });

	return {
		critique: await runCritic(state.rawIdea, config),
		completedAgents: ["critic"],
	};
};
