import {
	GlobeAltIcon,
	LightBulbIcon,
	MagnifyingGlassIcon,
	ShieldExclamationIcon,
	SparklesIcon,
	WrenchIcon,
} from "@heroicons/react/24/outline";

export type PipelineState = "idle" | "active" | "done";

export type PipelineNode = {
	id: string;
	label: string;
	Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
	desc: string;
};

export const PIPELINE_NODES: readonly PipelineNode[] = [
	{
		id: "parser",
		label: "Parser",
		Icon: MagnifyingGlassIcon,
		desc: "Reads the idea",
	},
	{
		id: "researcher",
		label: "Researcher",
		Icon: GlobeAltIcon,
		desc: "Studies the market",
	},
	{
		id: "critic",
		label: "Critic",
		Icon: ShieldExclamationIcon,
		desc: "Finds the risks",
	},
	{
		id: "opportunity",
		label: "Opportunity",
		Icon: LightBulbIcon,
		desc: "Finds the edge",
	},
	{
		id: "feasibility",
		label: "Feasibility",
		Icon: WrenchIcon,
		desc: "Maps the build",
	},
	{
		id: "synthesis",
		label: "Synthesis",
		Icon: SparklesIcon,
		desc: "Writes the verdict",
	},
] as const;
