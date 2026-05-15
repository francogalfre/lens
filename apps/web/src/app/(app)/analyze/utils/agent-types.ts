export type ParserPayload = {
	validationError?: unknown;
	parsedIdea?: Record<string, string>;
};

export type Competitor = {
	name: string;
	description: string;
	url?: string;
};

export type ResearcherPayload = {
	research?: {
		competitors?: Competitor[];
		marketContext?: string;
	};
};

export type CriticPayload = {
	critique?: {
		weaknesses?: string[];
		risks?: string[];
		deadlyAssumptions?: string[];
	};
};

export type OpportunityPayload = {
	opportunities?: {
		strengths?: string[];
		opportunities?: string[];
		differentiators?: string[];
	};
};

export type FeasibilityPayload = {
	feasibility?: {
		complexity?: string;
		estimatedTimeline?: string;
		techStack?: string[];
		mainChallenges?: string[];
	};
};

export type SynthesisPayload = {
	synthesis?: {
		overallScore?: number;
		verdict?: string;
		topRecommendations?: string[];
		summary?: string;
	};
};
