import type { RunnableConfig } from "@langchain/core/runnables";
import { getWriter } from "@langchain/langgraph";

import { runSynthesis } from "@/agents/synthesis/index";
import type { State } from "@/graph";

export const synthesisNode = async (state: State, config: RunnableConfig) => {
	if (state.validationError) return {};
	if (!state.parsedIdea) return {};

	getWriter()?.({ type: "nodeStart", agent: "synthesis_agent" });

	return {
		synthesis: await runSynthesis(
			{
				parsedIdea: state.parsedIdea,
				research: state.research ?? {
					competitors: [],
					marketContext: "",
					searchQueries: [],
					opportunities: [],
				},
				critique: state.critique ?? {
					weaknesses: [],
					risks: [],
					deadlyAssumptions: [],
				},
				opportunities: state.opportunities ?? {
					strengths: [],
					opportunities: [],
					differentiators: [],
				},
				feasibility: state.feasibility ?? {
					complexity: "",
					techStack: [],
					mainChallenges: [],
					estimatedTimeline: "",
				},
			},
			config,
		),
		completedAgents: ["synthesis"],
	};
};
