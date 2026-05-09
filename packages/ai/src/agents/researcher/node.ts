import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import { runResearcher } from "@/agents/researcher/index";
import type { State } from "@/graph";
import { buildIdeaContext } from "@/utils/format";

export const researcherNode = async (state: State, config: RunnableConfig) => {
	if (state.validationError) return {};

	getWriter()?.({ type: "nodeStart", agent: "researcher_agent" });

	return {
		research: await runResearcher(
			buildIdeaContext(state.rawIdea, state.parsedIdea),
			config,
		),
		completedAgents: ["researcher"],
	};
};
