"use client";

import { motion } from "motion/react";

import type { PipelineNode, PipelineState } from "../utils/pipeline-nodes";

const ActiveIndicator = () => (
	<motion.span
		initial={{ opacity: 0, x: -4 }}
		animate={{ opacity: 1, x: 0 }}
		className="relative flex h-1.5 w-1.5"
	>
		<span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-foreground/50" />
		<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground/80" />
	</motion.span>
);

const DoneCheck = () => (
	<motion.svg
		initial={{ opacity: 0, scale: 0.5 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ duration: 0.3 }}
		className="h-3.5 w-3.5 text-foreground/55"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="20 6 9 17 4 12" />
	</motion.svg>
);

export const NodeCard = ({
	node,
	state,
	compact,
	delay = 0,
}: {
	node: PipelineNode;
	state: PipelineState;
	compact?: boolean;
	delay?: number;
}) => {
	const { label, Icon, desc } = node;

	return (
		<motion.div
			animate={{ scale: state === "active" ? 1.02 : 1 }}
			transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
			className={`relative flex w-full items-center gap-2.5 overflow-hidden rounded-xl border bg-card/85 backdrop-blur-sm transition-colors duration-500 ${
				compact ? "px-3 py-2" : "px-3.5 py-3"
			} ${
				state === "active"
					? "border-foreground/35 shadow-[0_0_0_4px_color-mix(in_oklch,var(--foreground)_4%,transparent)]"
					: state === "done"
						? "border-foreground/15"
						: "border-border"
			}`}
		>
			{state === "active" && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="absolute inset-0 -z-10 animate-pulse bg-foreground/4"
				/>
			)}

			<motion.div
				animate={{
					backgroundColor:
						state === "active"
							? "var(--foreground)"
							: state === "done"
								? "color-mix(in oklch, var(--foreground) 10%, transparent)"
								: "color-mix(in oklch, var(--foreground) 5%, transparent)",
					color:
						state === "active"
							? "var(--background)"
							: state === "done"
								? "color-mix(in oklch, var(--foreground) 85%, transparent)"
								: "color-mix(in oklch, var(--foreground) 50%, transparent)",
				}}
				transition={{ duration: 0.4 }}
				className={`flex shrink-0 items-center justify-center rounded-lg ${
					compact ? "h-7 w-7" : "h-9 w-9"
				}`}
			>
				<Icon
					className={compact ? "h-3.5 w-3.5" : "h-4.5 w-4.5"}
					strokeWidth={2}
				/>
			</motion.div>

			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span
						className={`whitespace-nowrap font-medium text-sm ${
							state === "idle" ? "text-foreground/55" : "text-foreground"
						}`}
					>
						{label}
					</span>
					<div className="ml-auto flex shrink-0 items-center">
						{state === "active" && <ActiveIndicator />}
						{state === "done" && <DoneCheck />}
					</div>
				</div>
				<p className="mt-0.5 truncate text-foreground/50 text-xs leading-snug">
					{desc}
				</p>
			</div>
		</motion.div>
	);
};
