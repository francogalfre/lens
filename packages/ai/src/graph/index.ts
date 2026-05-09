import { END, START, StateGraph } from "@langchain/langgraph";

import { criticNode } from "@/agents/critic/node";
import { feasibilityNode } from "@/agents/feasibility/node";
import { opportunityNode } from "@/agents/opportunity/node";
import { parserNode } from "@/agents/parser/node";
import { researcherNode } from "@/agents/researcher/node";
import { synthesisNode } from "@/agents/synthesis/node";
import { AnalysisState } from "@/graph/state";

export type State = typeof AnalysisState.State;

const retryPolicy = { maxAttempts: 3, initialInterval: 1.0 };

export const analysisGraph = new StateGraph(AnalysisState)
	.addNode("parser_agent", parserNode, { retryPolicy })
	.addNode("researcher_agent", researcherNode, { retryPolicy })
	.addNode("critic_agent", criticNode, { retryPolicy })
	.addNode("opportunity_agent", opportunityNode, { retryPolicy })
	.addNode("feasibility_agent", feasibilityNode, { retryPolicy })
	.addNode("synthesis_agent", synthesisNode, { retryPolicy })

	.addEdge(START, "parser_agent")
	.addEdge("parser_agent", "researcher_agent")
	.addEdge("parser_agent", "critic_agent")
	.addEdge("parser_agent", "opportunity_agent")
	.addEdge("parser_agent", "feasibility_agent")
	.addEdge("researcher_agent", "synthesis_agent")
	.addEdge("critic_agent", "synthesis_agent")
	.addEdge("opportunity_agent", "synthesis_agent")
	.addEdge("feasibility_agent", "synthesis_agent")
	.addEdge("synthesis_agent", END)
	.compile();
