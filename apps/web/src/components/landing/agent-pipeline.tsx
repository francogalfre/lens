"use client";

import {
	GlobeAltIcon,
	LightBulbIcon,
	MagnifyingGlassIcon,
	ShieldExclamationIcon,
	SparklesIcon,
	WrenchIcon,
} from "@heroicons/react/24/outline";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const NODES = [
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

export function AgentPipeline() {
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

	const parserState: State =
		step >= 0 ? (step >= 1 ? "done" : "active") : "idle";
	const parallelState: State =
		step >= 1 ? (step >= 2 ? "done" : "active") : "idle";
	const synthState: State =
		step >= 2 ? (step >= 3 ? "done" : "active") : "idle";

	return (
		<div
			ref={containerRef}
			className="relative w-full overflow-hidden rounded-3xl border border-border bg-card/60 px-6 py-12 sm:px-12 sm:py-16"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
				style={{
					backgroundImage:
						"radial-gradient(currentColor 0.6px, transparent 0.6px)",
					backgroundSize: "24px 24px",
				}}
			/>

			<div className="pointer-events-none absolute top-1/2 left-1/2 h-[380px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.04] blur-3xl" />

			<div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(220px,1fr)_60px_minmax(260px,1.2fr)_60px_minmax(220px,1fr)]">
				{/* Stage 1: Parser */}
				<div className="flex w-full">
					<NodeCard node={NODES[0]} state={parserState} />
				</div>

				<Connector active={step >= 1} />

				{/* Stage 2: 4 parallel agents stacked */}
				<div className="flex w-full flex-col gap-2">
					{NODES.slice(1, 5).map((n, i) => (
						<NodeCard
							key={n.id}
							node={n}
							state={parallelState}
							compact
							delay={i * 0.08}
						/>
					))}
				</div>

				<Connector active={step >= 2} />

				{/* Stage 3: Synthesis */}
				<div className="flex w-full">
					<NodeCard node={NODES[5]} state={synthState} />
				</div>
			</div>

			{/* Stage labels */}
			<div className="relative mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[minmax(220px,1fr)_60px_minmax(260px,1.2fr)_60px_minmax(220px,1fr)]">
				<StageLabel index={1} text="Parse" active={step >= 0} />
				<span />
				<StageLabel index={2} text="Analyze in parallel" active={step >= 1} />
				<span />
				<StageLabel index={3} text="Synthesize" active={step >= 2} />
			</div>
		</div>
	);
}

function StageLabel({
	index,
	text,
	active,
}: {
	index: number;
	text: string;
	active: boolean;
}) {
	return (
		<div className="flex items-center justify-center gap-2 text-center">
			<span
				className={`text-xs tabular-nums transition-colors duration-500 ${
					active ? "text-foreground" : "text-muted-foreground/60"
				}`}
			>
				<span className="text-foreground/40">
					{String(index).padStart(2, "0")}
				</span>
				<span className="mx-1.5 text-foreground/25">/</span>
				<span className="font-medium">{text}</span>
			</span>
		</div>
	);
}

type State = "idle" | "active" | "done";

function NodeCard({
	node,
	state,
	compact,
	delay = 0,
}: {
	node: (typeof NODES)[number];
	state: State;
	compact?: boolean;
	delay?: number;
}) {
	const { label, Icon, desc } = node;

	return (
		<motion.div
			animate={{
				scale: state === "active" ? 1.02 : 1,
			}}
			transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
			className={`relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border bg-card/85 backdrop-blur-sm transition-colors duration-500 ${
				compact ? "px-3 py-2.5" : "px-4 py-4"
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
					className="absolute inset-0 -z-10 animate-pulse bg-foreground/[0.03]"
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
				className={`flex shrink-0 items-center justify-center rounded-xl ${
					compact ? "h-8 w-8" : "h-10 w-10"
				}`}
			>
				<Icon
					className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"}
					strokeWidth={2}
				/>
			</motion.div>

			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span
						className={`whitespace-nowrap font-medium ${compact ? "text-sm" : "text-[15px]"} ${
							state === "idle" ? "text-foreground/55" : "text-foreground"
						}`}
					>
						{label}
					</span>
					<div className="ml-auto flex shrink-0 items-center">
						{state === "active" && (
							<motion.span
								initial={{ opacity: 0, x: -4 }}
								animate={{ opacity: 1, x: 0 }}
								className="relative flex h-1.5 w-1.5"
							>
								<span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-foreground/50" />
								<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground/80" />
							</motion.span>
						)}
						{state === "done" && (
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
						)}
					</div>
				</div>
				<p
					className={`mt-0.5 truncate text-foreground/50 leading-snug ${
						compact ? "text-[11.5px]" : "text-xs"
					}`}
				>
					{desc}
				</p>
			</div>
		</motion.div>
	);
}

function Connector({ active }: { active: boolean }) {
	return (
		<div className="relative hidden items-center justify-center lg:flex">
			<svg
				className="h-3 w-full"
				viewBox="0 0 60 12"
				preserveAspectRatio="xMidYMid meet"
				fill="none"
			>
				<title>Connector</title>
				<motion.path
					d="M 2 6 L 52 6"
					stroke="currentColor"
					strokeWidth="0.6"
					strokeDasharray="2 2.5"
					className="text-foreground/15"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 0.5 }}
				/>
				<motion.path
					d="M 2 6 L 52 6"
					stroke="currentColor"
					strokeWidth="0.75"
					className="text-foreground/70"
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{
						pathLength: active ? 1 : 0,
						opacity: active ? 1 : 0,
					}}
					transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
				/>
				<motion.path
					d="M 50 3.5 L 54 6 L 50 8.5"
					stroke="currentColor"
					strokeWidth="0.75"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-foreground/70"
					initial={{ opacity: 0.25 }}
					animate={{ opacity: active ? 1 : 0.25 }}
					transition={{ duration: 0.4, delay: active ? 0.4 : 0 }}
				/>

				{active && (
					<motion.circle
						r="1.25"
						fill="currentColor"
						className="text-foreground"
						initial={{ offsetDistance: "0%", opacity: 0 }}
						animate={{
							offsetDistance: "100%",
							opacity: [0, 1, 1, 0],
						}}
						transition={{
							duration: 1.4,
							ease: "linear",
							repeat: Number.POSITIVE_INFINITY,
						}}
						style={{ offsetPath: 'path("M 2 6 L 52 6")' }}
					/>
				)}
			</svg>
		</div>
	);
}
