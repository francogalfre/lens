import { StateGraph, START, END } from "@langchain/langgraph";

import { AnalysisState } from "./state";
import { runParser } from "@/agents/parser";
import { runResearcher } from "@/agents/researcher";
import { runCritic } from "@/agents/critic";
import { runOpportunity } from "@/agents/opportunity";
import { runFeasibility } from "@/agents/feasibility";
import { runSynthesis } from "@/agents/synthesis";

type State = typeof AnalysisState.State;

const parserNode = async (state: State) => ({
  parsedIdea: await runParser(state.rawIdea),
  completedAgents: ["parser"],
});

const researcherNode = async (state: State) => ({
  research: await runResearcher(state.rawIdea),
  completedAgents: ["researcher"],
});

const criticNode = async (state: State) => ({
  critique: await runCritic(state.rawIdea),
  completedAgents: ["critic"],
});

const opportunityNode = async (state: State) => ({
  opportunities: await runOpportunity(state.rawIdea),
  completedAgents: ["opportunity"],
});

const feasibilityNode = async (state: State) => ({
  feasibility: await runFeasibility(state.rawIdea),
  completedAgents: ["feasibility"],
});

const synthesisNode = async (state: State) => ({
  synthesis: await runSynthesis({
    parsedIdea: state.parsedIdea!,
    research: state.research!,
    critique: state.critique!,
    opportunities: state.opportunities!,
    feasibility: state.feasibility!,
  }),
  completedAgents: ["synthesis"],
});

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
