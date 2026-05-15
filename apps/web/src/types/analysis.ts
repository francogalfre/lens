export interface ParsedIdea {
	problem?: string;
	solution?: string;
	targetAudience?: string;
	techDomain?: string;
	category?: string;
}

export interface ResearchData {
	competitors?: { name: string; description: string; url: string }[];
	marketContext?: string;
	searchQueries?: string[];
	opportunities?: string[];
}

export interface CritiqueData {
	weaknesses?: string[];
	risks?: string[];
	deadlyAssumptions?: string[];
}

export interface OpportunityData {
	strengths?: string[];
	opportunities?: string[];
	differentiators?: string[];
}

export interface FeasibilityData {
	complexity?: string;
	techStack?: string[];
	mainChallenges?: string[];
	estimatedTimeline?: string;
}

export interface SynthesisScores {
	market: number;
	differentiation: number;
	feasibility: number;
	risk: number;
}

export interface SynthesisData {
	overallScore: number;
	verdict: string;
	summary: string;
	topRecommendations: string[];
	scores?: SynthesisScores;
}

export interface AnalysisData {
	rawIdea: string;
	parsedIdea: ParsedIdea | null;
	research: ResearchData | null;
	critique: CritiqueData | null;
	opportunities: OpportunityData | null;
	feasibility: FeasibilityData | null;
	synthesis: SynthesisData | null;
}

// ==================== Stream & Agent Types ====================

export type Status = "idle" | "running" | "complete" | "error";

export interface StreamEvent {
	type: "start" | "nodeStart" | "agent" | "complete" | "error";
	sessionId?: string;
	agent?: string;
	data?: Record<string, unknown>;
	error?: string;
}

export interface SynthesisResult {
	overallScore: number;
	verdict: string;
	topRecommendations: string[];
	summary: string;
	scores?: {
		market: number;
		differentiation: number;
		feasibility: number;
		risk: number;
	};
}

export interface AgentMessage {
	type: "status" | "complete" | "error";
	text: string;
}

export interface AgentState {
	name: string;
	status: "pending" | "running" | "complete";
	data: Record<string, unknown> | null;
	messages: AgentMessage[];
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

export interface UseAnalysisReturn {
	status: Status;
	agents: AgentState[];
	synthesis: SynthesisResult | null;
	errorMsg: string | null;
	isRunning: boolean;
	isComplete: boolean;
	limitReached: boolean;
	submitIdea: (idea: string) => Promise<void>;
	reset: () => void;
}
