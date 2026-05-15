"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { AgentState } from "@/hooks/analysis.types";
import { AGENT_META, type AgentMeta } from "../utils/agent-meta";
import { AgentExpandPanel } from "./agent-expand-panel";
import { StatusIndicator } from "./status-indicator";

const previouslyAnimatedAgents = new Set<string>();

const AgentLabel = ({
	label,
	isRunning,
	isComplete,
}: {
	label: string;
	isRunning: boolean;
	isComplete: boolean;
}) => (
	<motion.span
		animate={{
			color: isRunning
				? "var(--foreground)"
				: isComplete
					? "color-mix(in srgb, var(--foreground) 70%, transparent)"
					: "var(--muted-foreground)",
		}}
		transition={{ duration: 0.3 }}
		className={`flex-1 font-medium text-sm ${isRunning ? "animate-pulse" : ""}`}
	>
		{label}
	</motion.span>
);

const AgentIcon = ({
	Icon,
	isRunning,
	isPending,
}: {
	Icon: AgentMeta["Icon"];
	isRunning: boolean;
	isPending: boolean;
}) => (
	<motion.span
		animate={isRunning ? { scale: [1, 1.05, 1] } : { scale: 1 }}
		transition={
			isRunning
				? {
						duration: 1.6,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}
				: { duration: 0.2 }
		}
		className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
			isRunning ? "bg-foreground/10" : ""
		} ${isPending ? "text-muted-foreground/40" : "text-muted-foreground"}`}
	>
		<Icon className="h-4 w-4" />
	</motion.span>
);

export const AgentItem = ({ agent }: { agent: AgentState }) => {
	const meta = AGENT_META[agent.name];
	const [isExpanded, setIsExpanded] = useState(false);
	const wasRunningWhenExpandedRef = useRef(false);

	const isPending = agent.status === "pending";
	const isRunning = agent.status === "running";
	const isComplete = agent.status === "complete";
	const canExpand = isRunning || isComplete;

	const shouldAnimateContent =
		isComplete &&
		(wasRunningWhenExpandedRef.current ||
			!previouslyAnimatedAgents.has(agent.name));

	useEffect(() => {
		if (isComplete && isExpanded && shouldAnimateContent) {
			previouslyAnimatedAgents.add(agent.name);
		}
	}, [isComplete, isExpanded, shouldAnimateContent, agent.name]);

	if (!meta) return null;

	const handleToggle = () => {
		if (!canExpand) return;
		if (!isExpanded && isRunning) {
			wasRunningWhenExpandedRef.current = true;
		}
		setIsExpanded((current) => !current);
	};

	return (
		<motion.div
			layout="position"
			transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
			className={isRunning ? "py-1" : ""}
		>
			<button
				type="button"
				onClick={handleToggle}
				className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors ${
					canExpand ? "cursor-pointer hover:bg-accent/50" : "cursor-default"
				} ${isPending ? "opacity-35" : ""}`}
				disabled={isPending}
			>
				<StatusIndicator isRunning={isRunning} isComplete={isComplete} />
				<AgentIcon
					Icon={meta.Icon}
					isRunning={isRunning}
					isPending={isPending}
				/>
				<AgentLabel
					label={meta.label}
					isRunning={isRunning}
					isComplete={isComplete}
				/>
				{canExpand && (
					<motion.span
						animate={{ rotate: isExpanded ? 90 : 0 }}
						transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
						className="shrink-0 text-muted-foreground/40"
					>
						<ChevronRightIcon className="h-4 w-4" />
					</motion.span>
				)}
			</button>
			<AgentExpandPanel
				isExpanded={isExpanded}
				canExpand={canExpand}
				isRunning={isRunning}
				isComplete={isComplete}
				agentName={agent.name}
				agentData={agent.data}
				steps={meta.steps}
				shouldAnimateContent={shouldAnimateContent}
			/>
		</motion.div>
	);
};
