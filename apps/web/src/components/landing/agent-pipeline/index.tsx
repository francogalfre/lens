"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PIPELINE_NODES, type PipelineState } from "../utils/pipeline-nodes";
import { HorizontalConnector, VerticalConnector } from "./connector";
import { NodeCard } from "./node-card";
import { MobileStageLabel, StageLabel } from "./stage-label";

const computePipelineState = (
	step: number,
	startStep: number,
): PipelineState => {
	if (step >= startStep + 1) return "done";
	if (step >= startStep) return "active";
	return "idle";
};

const PipelineBackground = () => (
	<>
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 opacity-6 dark:opacity-8"
			style={{
				backgroundImage:
					"radial-gradient(currentColor 0.6px, transparent 0.6px)",
				backgroundSize: "24px 24px",
			}}
		/>
		<div className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[280px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/4 blur-3xl lg:block" />
	</>
);

const ParallelNodes = ({ state }: { state: PipelineState }) => (
	<div className="flex w-full flex-col gap-2">
		{PIPELINE_NODES.slice(1, 5).map((node, index) => (
			<NodeCard
				key={node.id}
				node={node}
				state={state}
				compact
				delay={index * 0.08}
			/>
		))}
	</div>
);

export const AgentPipeline = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const inView = useInView(containerRef, { once: true, margin: "-15% 0px" });
	const [step, setStep] = useState(-1);

	useEffect(() => {
		if (!inView) return;
		const timers = [
			setTimeout(() => setStep(0), 400),
			setTimeout(() => setStep(1), 1200),
			setTimeout(() => setStep(2), 2200),
			setTimeout(() => setStep(3), 3000),
		];
		return () => timers.forEach(clearTimeout);
	}, [inView]);

	const parserState = computePipelineState(step, 0);
	const parallelState = computePipelineState(step, 1);
	const synthesisState = computePipelineState(step, 2);

	return (
		<div
			ref={containerRef}
			className="relative w-full overflow-hidden rounded-2xl border border-border bg-card/60 px-6 py-8 sm:px-10 sm:py-12"
		>
			<PipelineBackground />

			<div className="flex flex-col gap-4 lg:hidden">
				<div className="flex w-full">
					<NodeCard node={PIPELINE_NODES[0]} state={parserState} />
				</div>
				<VerticalConnector active={step >= 1} />
				<ParallelNodes state={parallelState} />
				<VerticalConnector active={step >= 2} />
				<div className="flex w-full">
					<NodeCard node={PIPELINE_NODES[5]} state={synthesisState} />
				</div>
				<div className="mt-2 flex items-center justify-center gap-4">
					<MobileStageLabel text="Parse" active={step >= 0} />
					<MobileStageLabel text="Analyze" active={step >= 1} />
					<MobileStageLabel text="Synthesize" active={step >= 2} />
				</div>
			</div>

			<div className="hidden lg:block">
				<div className="relative mx-auto grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(180px,1fr)_50px_minmax(200px,1fr)_50px_minmax(180px,1fr)]">
					<div className="flex w-full">
						<NodeCard node={PIPELINE_NODES[0]} state={parserState} />
					</div>
					<HorizontalConnector active={step >= 1} />
					<ParallelNodes state={parallelState} />
					<HorizontalConnector active={step >= 2} />
					<div className="flex w-full">
						<NodeCard node={PIPELINE_NODES[5]} state={synthesisState} />
					</div>
				</div>

				<div className="relative mx-auto mt-6 grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(180px,1fr)_50px_minmax(200px,1fr)_50px_minmax(180px,1fr)]">
					<StageLabel index={1} text="Parse" active={step >= 0} />
					<span />
					<StageLabel index={2} text="Analyze" active={step >= 1} />
					<span />
					<StageLabel index={3} text="Synthesize" active={step >= 2} />
				</div>
			</div>
		</div>
	);
};
