import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import type { State } from "@/graph";
import { runFeasibility } from "./index";

export const feasibilityNode = async (state: State, config: RunnableConfig) => {
	if (state.validationError) return {};
	getWriter()?.({ type: "nodeStart", agent: "feasibility_agent" });

	return {
		feasibility: await runFeasibility(state.rawIdea, config),
		completedAgents: ["feasibility"],
	};
};
