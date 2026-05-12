"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { Loader } from "@lens/ui/components/loading-breadcrumb";
import { motion } from "motion/react";

import type { AgentState } from "@/hooks/analysis.types";

const LABELS: Record<string, { title: string; running: string }> = {
	parser_agent: { title: "Parse idea", running: "Reading" },
	researcher_agent: { title: "Research market", running: "Searching" },
	critic_agent: { title: "Stress-test risks", running: "Critiquing" },
	opportunity_agent: { title: "Find the edge", running: "Mapping" },
	feasibility_agent: { title: "Map the build", running: "Sizing" },
	synthesis_agent: { title: "Synthesize verdict", running: "Writing" },
};

const ORDER = [
	"parser_agent",
	"researcher_agent",
	"critic_agent",
	"opportunity_agent",
	"feasibility_agent",
	"synthesis_agent",
];

interface AgentStepListProps {
	agents: AgentState[];
}

export function AgentStepList({ agents }: AgentStepListProps) {
	const byName = new Map(agents.map((a) => [a.name, a]));

	return (
		<ol className="flex flex-col gap-1.5">
			{ORDER.map((name, i) => {
				const state = byName.get(name);
				const status = state?.status ?? "pending";
				const meta = LABELS[name];
				if (!meta) return null;

				return (
					<motion.li
						key={name}
						initial={{ opacity: 0, x: -4 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3, delay: i * 0.04 }}
						className="flex items-center gap-2.5 py-1.5"
					>
						<StatusIndicator status={status} />
						<span
							className={
								status === "running"
									? "lens-shimmer-text bg-clip-text font-medium text-[14px] text-transparent"
									: status === "complete"
										? "font-medium text-[14px] text-foreground"
										: "text-[14px] text-foreground/40"
							}
							style={
								status === "running"
									? {
											backgroundSize: "200% auto",
											animation: "lensTextShimmer 2s ease-in-out infinite",
										}
									: undefined
							}
						>
							{status === "running" ? meta.running : meta.title}
						</span>
					</motion.li>
				);
			})}
		</ol>
	);
}

function StatusIndicator({ status }: { status: AgentState["status"] }) {
	if (status === "running") {
		return (
			<Loader
				size={14}
				strokeWidth={2.5}
				className="shrink-0 text-foreground/80"
			/>
		);
	}
	if (status === "complete") {
		return (
			<motion.span
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.2 }}
				className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-foreground"
			>
				<CheckIcon className="h-2.5 w-2.5 text-background" strokeWidth={3} />
			</motion.span>
		);
	}
	return (
		<span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
			<span className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
		</span>
	);
}
