import type { RunnableConfig } from "@langchain/core/runnables";
import { END, getWriter, START, StateGraph } from "@langchain/langgraph";
import { runCritic } from "../agents/critic";
import { runFeasibility } from "../agents/feasibility";
import { runOpportunity } from "../agents/opportunity";
import { runParser } from "../agents/parser";
import { runResearcher } from "../agents/researcher";
import { runSynthesis } from "../agents/synthesis";
import { AnalysisState } from "./state";

type State = typeof AnalysisState.State;

const parserNode = async (state: State, config: RunnableConfig) => {
	getWriter()?.({ type: "nodeStart", agent: "parser" });
	return {
		parsedIdea: await runParser(state.rawIdea, config),
		completedAgents: ["parser"],
	};
};

const researcherNode = async (state: State, config: RunnableConfig) => {
	getWriter()?.({ type: "nodeStart", agent: "researcher" });
	return {
		research: await runResearcher(state.rawIdea, config),
		completedAgents: ["researcher"],
	};
};

const criticNode = async (state: State, config: RunnableConfig) => {
	getWriter()?.({ type: "nodeStart", agent: "critic" });
	return {
		critique: await runCritic(state.rawIdea, config),
		completedAgents: ["critic"],
	};
};

const opportunityNode = async (state: State, config: RunnableConfig) => {
	getWriter()?.({ type: "nodeStart", agent: "opportunity" });
	return {
		opportunities: await runOpportunity(state.rawIdea, config),
		completedAgents: ["opportunity"],
	};
};

const feasibilityNode = async (state: State, config: RunnableConfig) => {
	getWriter()?.({ type: "nodeStart", agent: "feasibility_agent" });
	return {
		feasibility: await runFeasibility(state.rawIdea, config),
		completedAgents: ["feasibility"],
	};
};

const synthesisNode = async (state: State, config: RunnableConfig) => {
	getWriter()?.({ type: "nodeStart", agent: "synthesis_agent" });
	return {
		synthesis: await runSynthesis(
			{
				parsedIdea: state.parsedIdea!,
				research: state.research!,
				critique: state.critique!,
				opportunities: state.opportunities!,
				feasibility: state.feasibility!,
			},
			config,
		),
		completedAgents: ["synthesis"],
	};
};

export const analysisGraph = new StateGraph(AnalysisState)
	.addNode("parser", parserNode)
	.addNode("researcher", researcherNode)
	.addNode("critic", criticNode)
	.addNode("opportunity", opportunityNode)
	.addNode("feasibility_agent", feasibilityNode)
	.addNode("synthesis_agent", synthesisNode)

	.addEdge(START, "parser")
	.addEdge("parser", "researcher")
	.addEdge("parser", "critic")
	.addEdge("parser", "opportunity")
	.addEdge("parser", "feasibility_agent")
	.addEdge("researcher", "synthesis_agent")
	.addEdge("critic", "synthesis_agent")
	.addEdge("opportunity", "synthesis_agent")
	.addEdge("feasibility_agent", "synthesis_agent")
	.addEdge("synthesis_agent", END)
	.compile();
