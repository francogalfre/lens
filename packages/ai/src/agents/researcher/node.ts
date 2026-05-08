import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import type { State } from "@/graph";
import { runResearcher } from "./index";

export const researcherNode = async (state: State, config: RunnableConfig) => {
	if (state.validationError) return {};
	getWriter()?.({ type: "nodeStart", agent: "researcher_agent" });

	return {
		research: await runResearcher(state.rawIdea, config),
		completedAgents: ["researcher"],
	};
};
