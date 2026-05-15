"use client";

import { BlurFade } from "@lens/ui/components/blur-fade";
import { AnimatePresence, motion } from "motion/react";

import { AgentContent } from "./agent-content";
import { RunningSteps } from "./running-steps";

export const AgentExpandPanel = ({
	isExpanded,
	canExpand,
	isRunning,
	isComplete,
	agentName,
	agentData,
	steps,
	shouldAnimateContent,
}: {
	isExpanded: boolean;
	canExpand: boolean;
	isRunning: boolean;
	isComplete: boolean;
	agentName: string;
	agentData: unknown;
	steps: string[];
	shouldAnimateContent: boolean;
}) => (
	<AnimatePresence initial={false}>
		{isExpanded && canExpand && (
			<motion.div
				key="content"
				initial={{ height: 0, opacity: 0 }}
				animate={{ height: "auto", opacity: 1 }}
				exit={{ height: 0, opacity: 0 }}
				transition={{
					height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
					opacity: { duration: 0.2 },
				}}
				style={{ overflow: "hidden" }}
			>
				<div className="ml-14 pr-4 pb-4">
					{isRunning && <RunningSteps steps={steps} isComplete={false} />}

					{isComplete && (
						<BlurFade delay={0.1} duration={0.4}>
							<AgentContent
								agent={agentName}
								data={agentData}
								animate={shouldAnimateContent}
							/>
						</BlurFade>
					)}
				</div>
			</motion.div>
		)}
	</AnimatePresence>
);
