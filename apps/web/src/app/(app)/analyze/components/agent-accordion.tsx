"use client";

import { motion } from "motion/react";

import type { AgentState } from "@/hooks/analysis.types";
import { AgentItem } from "./agent-item";

export const AgentAccordion = ({ agents }: { agents: AgentState[] }) => {
	if (agents.length === 0) return null;

	const completedCount = agents.filter(
		(agent) => agent.status === "complete",
	).length;

	return (
		<motion.div
			layout="position"
			transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
			className="space-y-2"
		>
			<div className="mb-3 flex items-center justify-between px-4">
				<span className="font-mono text-[11px] text-muted-foreground/50 uppercase tracking-widest">
					Agents
				</span>
				<motion.span
					key={completedCount}
					initial={{ scale: 1.2, opacity: 0.5 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
					className="font-mono text-[11px] text-muted-foreground/50"
				>
					{completedCount}/{agents.length}
				</motion.span>
			</div>
			{agents.map((agent) => (
				<AgentItem key={agent.name} agent={agent} />
			))}
		</motion.div>
	);
};
