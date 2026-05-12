export type Status = "idle" | "running" | "complete" | "error";

export interface StreamEvent {
	type: "start" | "nodeStart" | "agent" | "complete" | "error";
	sessionId?: string;
	agent?: string;
	data?: unknown;
	error?: string;
}

export interface SynthesisResult {
	overallScore: number;
	verdict: string;
	topRecommendations: string[];
	summary: string;
}

export interface AgentMessage {
	type: "status" | "complete" | "error";
	text: string;
}

export interface AgentState {
	name: string;
	status: "pending" | "running" | "complete";
	data: unknown;
	messages?: AgentMessage[];
}

export const AGENT_ORDER = [
	"parser_agent",
	"researcher_agent",
	"critic_agent",
	"opportunity_agent",
	"feasibility_agent",
	"synthesis_agent",
] as const;

export type AgentName = (typeof AGENT_ORDER)[number];
