"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STEP_DELAY_MS = 1600;

const StepIndicator = ({
	isDone,
	isActive,
}: {
	isDone: boolean;
	isActive: boolean;
}) => (
	<span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
		<AnimatePresence mode="wait" initial={false}>
			{isDone ? (
				<motion.span
					key="done"
					initial={{ scale: 0, rotate: -45, opacity: 0 }}
					animate={{ scale: 1, rotate: 0, opacity: 1 }}
					exit={{ scale: 0, opacity: 0 }}
					transition={{ type: "spring", stiffness: 500, damping: 22 }}
					className="absolute inset-0 flex items-center justify-center"
				>
					<CheckIcon className="h-3 w-3 text-foreground/70" strokeWidth={2.5} />
				</motion.span>
			) : isActive ? (
				<motion.span
					key="active"
					initial={{ scale: 0.6, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.6, opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="absolute inset-0 flex items-center justify-center"
				>
					<span className="relative flex h-2 w-2">
						<span className="absolute inset-0 animate-ping rounded-full bg-foreground/60 opacity-75" />
						<span className="h-2 w-2 rounded-full bg-foreground/80" />
					</span>
				</motion.span>
			) : (
				<motion.span
					key="pending"
					initial={{ scale: 0.6, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.6, opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="absolute inset-0 flex items-center justify-center"
				>
					<span className="h-1.5 w-1.5 rounded-full border border-muted-foreground/30" />
				</motion.span>
			)}
		</AnimatePresence>
	</span>
);

export const RunningSteps = ({
	steps,
	isComplete,
}: {
	steps: string[];
	isComplete: boolean;
}) => {
	const [activeStepIndex, setActiveStepIndex] = useState(0);

	useEffect(() => {
		if (isComplete) return;
		const timers = [
			setTimeout(() => setActiveStepIndex(1), STEP_DELAY_MS),
			setTimeout(() => setActiveStepIndex(2), STEP_DELAY_MS * 2),
		];
		return () => timers.forEach(clearTimeout);
	}, [isComplete]);

	const effectiveStep = isComplete ? steps.length : activeStepIndex;

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
			}}
			className="space-y-2.5 pt-4 pb-2"
		>
			{steps.map((stepLabel, index) => {
				const isDone = index < effectiveStep;
				const isActive = index === effectiveStep;
				return (
					<motion.div
						key={index}
						variants={{
							hidden: { opacity: 0, x: -8 },
							visible: { opacity: 1, x: 0 },
						}}
						transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
						className={`flex items-center gap-3 ${
							!isDone && !isActive ? "opacity-30" : ""
						}`}
					>
						<StepIndicator isDone={isDone} isActive={isActive} />
						<motion.span
							animate={{
								color: isActive
									? "var(--foreground)"
									: "var(--muted-foreground)",
							}}
							transition={{ duration: 0.25 }}
							className="text-sm"
						>
							{stepLabel}
						</motion.span>
					</motion.div>
				);
			})}
		</motion.div>
	);
};
