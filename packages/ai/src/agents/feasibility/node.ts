import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import { runFeasibility } from "@/agents/feasibility/index";
import type { State } from "@/graph";
import { buildIdeaContext } from "@/utils/format";

export const feasibilityNode = async (state: State, config: RunnableConfig) => {
	if (state.validationError) return {};

	getWriter()?.({ type: "nodeStart", agent: "feasibility_agent" });

	return {
		feasibility: await runFeasibility(
			buildIdeaContext(state.rawIdea, state.parsedIdea, state.language),
			config,
		),
		completedAgents: ["feasibility"],
	};
};
