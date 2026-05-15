import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import { runCritic } from "@/agents/critic/index";
import type { State } from "@/graph";
import { buildIdeaContext } from "@/utils/format";

export const criticNode = async (state: State, config: RunnableConfig) => {
	if (state.validationError) return {};

	getWriter()?.({ type: "nodeStart", agent: "critic_agent" });

	return {
		critique: await runCritic(
			buildIdeaContext(state.rawIdea, state.parsedIdea, state.language),
			config,
		),
		completedAgents: ["critic"],
	};
};
