import {
	GlobeAltIcon,
	LightBulbIcon,
	MagnifyingGlassIcon,
	ShieldExclamationIcon,
	SparklesIcon,
	WrenchIcon,
} from "@heroicons/react/24/outline";

export type AgentMeta = {
	label: string;
	Icon: React.ComponentType<{ className?: string }>;
	steps: string[];
};

export const AGENT_META: Record<string, AgentMeta> = {
	parser_agent: {
		label: "Idea parser",
		Icon: MagnifyingGlassIcon,
		steps: [
			"Extracting core problem…",
			"Identifying target audience…",
			"Categorizing domain…",
		],
	},
	researcher_agent: {
		label: "Market researcher",
		Icon: GlobeAltIcon,
		steps: [
			"Querying market data…",
			"Scanning competitors…",
			"Analyzing trends…",
		],
	},
	critic_agent: {
		label: "Risk analyst",
		Icon: ShieldExclamationIcon,
		steps: [
			"Testing assumptions…",
			"Mapping risk vectors…",
			"Identifying weak points…",
		],
	},
	opportunity_agent: {
		label: "Opportunity scout",
		Icon: LightBulbIcon,
		steps: [
			"Scanning market gaps…",
			"Finding differentiators…",
			"Mapping growth vectors…",
		],
	},
	feasibility_agent: {
		label: "Feasibility checker",
		Icon: WrenchIcon,
		steps: [
			"Evaluating complexity…",
			"Assessing tech stack…",
			"Estimating timeline…",
		],
	},
	synthesis_agent: {
		label: "Synthesis",
		Icon: SparklesIcon,
		steps: [
			"Weighing all signals…",
			"Forming verdict…",
			"Writing recommendations…",
		],
	},
};
