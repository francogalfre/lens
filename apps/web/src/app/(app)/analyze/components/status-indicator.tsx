"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";

type StatusState = "pending" | "running" | "complete";

const PendingDot = () => (
	<motion.span
		key="pending"
		initial={{ scale: 0.5, opacity: 0 }}
		animate={{ scale: 1, opacity: 1 }}
		exit={{ scale: 0.5, opacity: 0 }}
		transition={{ duration: 0.2 }}
		className="absolute inset-0 flex items-center justify-center"
	>
		<span className="h-2 w-2 rounded-full border border-muted-foreground/40" />
	</motion.span>
);

const RunningDot = () => (
	<motion.span
		key="running"
		initial={{ scale: 0.5, opacity: 0 }}
		animate={{ scale: 1, opacity: 1 }}
		exit={{ scale: 0.5, opacity: 0 }}
		transition={{ duration: 0.2 }}
		className="absolute inset-0 flex items-center justify-center"
	>
		<span className="relative flex h-3 w-3">
			<span className="absolute inset-0 animate-ping rounded-full bg-foreground/50 opacity-75" />
			<span className="h-3 w-3 rounded-full bg-foreground/90" />
		</span>
	</motion.span>
);

const CompleteCheck = () => (
	<motion.span
		key="complete"
		initial={{ scale: 0, rotate: -90, opacity: 0 }}
		animate={{ scale: 1, rotate: 0, opacity: 1 }}
		exit={{ scale: 0, opacity: 0 }}
		transition={{ type: "spring", stiffness: 480, damping: 20 }}
		className="absolute inset-0 flex items-center justify-center"
	>
		<CheckIcon className="h-4 w-4 text-foreground/70" strokeWidth={2.5} />
	</motion.span>
);

const Ripple = () => (
	<motion.span
		initial={{ scale: 0, opacity: 0.5 }}
		animate={{ scale: 2.2, opacity: 0 }}
		transition={{ duration: 0.6, ease: "easeOut" }}
		className="absolute inset-0 rounded-full bg-foreground/20"
	/>
);

export const StatusIndicator = ({
	isRunning,
	isComplete,
}: {
	isRunning: boolean;
	isComplete: boolean;
}) => {
	const state: StatusState = isComplete
		? "complete"
		: isRunning
			? "running"
			: "pending";

	return (
		<span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
			<AnimatePresence mode="wait" initial={false}>
				{state === "pending" && <PendingDot />}
				{state === "running" && <RunningDot />}
				{state === "complete" && <CompleteCheck />}
			</AnimatePresence>
			{state === "complete" && <Ripple />}
		</span>
	);
};
