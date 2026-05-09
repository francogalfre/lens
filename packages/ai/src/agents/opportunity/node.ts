import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import { runOpportunity } from "@/agents/opportunity/index";
import type { State } from "@/graph";
import { buildIdeaContext } from "@/utils/format";

export const opportunityNode = async (state: State, config: RunnableConfig) => {
	if (state.validationError) return {};

	getWriter()?.({ type: "nodeStart", agent: "opportunity_agent" });

	return {
		opportunities: await runOpportunity(
			buildIdeaContext(state.rawIdea, state.parsedIdea),
			config,
		),
		completedAgents: ["opportunity"],
	};
};
