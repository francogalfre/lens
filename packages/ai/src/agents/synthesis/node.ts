import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import type { State } from "@/graph";
import { runSynthesis } from "./index";

export const synthesisNode = async (state: State, config: RunnableConfig) => {
	if (state.validationError) return {};

	if (
		!state.parsedIdea ||
		!state.research ||
		!state.critique ||
		!state.opportunities ||
		!state.feasibility
	) {
		return {};
	}

	getWriter()?.({ type: "nodeStart", agent: "synthesis_agent" });

	return {
		synthesis: await runSynthesis(
			{
				parsedIdea: state.parsedIdea,
				research: state.research,
				critique: state.critique,
				opportunities: state.opportunities,
				feasibility: state.feasibility,
			},
			config,
		),
		completedAgents: ["synthesis"],
	};
};
