import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import type { State } from "@/graph";
import { runOpportunity } from "./index";

export const opportunityNode = async (state: State, config: RunnableConfig) => {
	if (state.validationError) return {};
	getWriter()?.({ type: "nodeStart", agent: "opportunity_agent" });

	return {
		opportunities: await runOpportunity(state.rawIdea, config),
		completedAgents: ["opportunity"],
	};
};
