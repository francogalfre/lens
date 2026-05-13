"use client";

import {
	CheckIcon,
	ChevronRightIcon,
	GlobeAltIcon,
	LightBulbIcon,
	MagnifyingGlassIcon,
	ShieldExclamationIcon,
	SparklesIcon,
	WrenchIcon,
} from "@heroicons/react/24/outline";
import { BlurFade } from "@lens/ui/components/blur-fade";
import { useEffect, useRef, useState } from "react";

import type { AgentMessage, AgentState } from "@/hooks/analysis.types";

const cap = (s?: string): string | undefined =>
	s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined;

export type { AgentMessage, AgentState };

const animatedAgents = new Set<string>();

function TypewriterText({
	text,
	animate,
	speed = 12,
}: {
	text: string;
	animate: boolean;
	speed?: number;
}) {
	const [displayed, setDisplayed] = useState(animate ? "" : text);

	useEffect(() => {
		if (!animate) {
			setDisplayed(text);
			return;
		}
		let i = 0;
		setDisplayed("");
		const id = setInterval(() => {
			i++;
			setDisplayed(text.slice(0, i));
			if (i >= text.length) clearInterval(id);
		}, speed);
		return () => clearInterval(id);
	}, [text, animate, speed]);

	return <>{displayed}</>;
}

function AnimatedScore({
	value,
	animate,
}: {
	value: number;
	animate: boolean;
}) {
	const [n, setN] = useState(animate ? 0 : value);

	useEffect(() => {
		if (!animate) {
			setN(value);
			return;
		}
		const start = performance.now();
		const duration = 700;
		let raf = 0;
		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / duration);
			const eased = 1 - (1 - t) ** 3;
			setN(Math.round(value * eased * 10) / 10);
			if (t < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [value, animate]);

	return <>{n}</>;
}

const AGENT_META: Record<
	string,
	{
		label: string;
		Icon: React.ComponentType<{ className?: string }>;
		steps: string[];
	}
> = {
	parser_agent: {
		label: "Idea parser",
		Icon: MagnifyingGlassIcon,
		steps: [
			"Extracting core problem…",
			"Identifying target audience…",
			"Categorizing domain…",
		],
	},
	researcher_agent: {
		label: "Market researcher",
		Icon: GlobeAltIcon,
		steps: [
			"Querying market data…",
			"Scanning competitors…",
			"Analyzing trends…",
		],
	},
	critic_agent: {
		label: "Risk analyst",
		Icon: ShieldExclamationIcon,
		steps: [
			"Testing assumptions…",
			"Mapping risk vectors…",
			"Identifying weak points…",
		],
	},
	opportunity_agent: {
		label: "Opportunity scout",
		Icon: LightBulbIcon,
		steps: [
			"Scanning market gaps…",
			"Finding differentiators…",
			"Mapping growth vectors…",
		],
	},
	feasibility_agent: {
		label: "Feasibility checker",
		Icon: WrenchIcon,
		steps: [
			"Evaluating complexity…",
			"Assessing tech stack…",
			"Estimating timeline…",
		],
	},
	synthesis_agent: {
		label: "Synthesis",
		Icon: SparklesIcon,
		steps: [
			"Weighing all signals…",
			"Forming verdict…",
			"Writing recommendations…",
		],
	},
};

function Label({ children }: { children: React.ReactNode }) {
	return (
		<span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
			{children}
		</span>
	);
}

function Field({ label, value }: { label: string; value?: string }) {
	if (!value) return null;
	const text = cap(value) ?? "";
	return (
		<div className="space-y-0.5">
			<Label>{label}</Label>
			<p className="text-foreground/80 text-sm leading-relaxed">{text}</p>
		</div>
	);
}

function BulletList({ label, items }: { label: string; items: string[] }) {
	return (
		<div className="space-y-1.5">
			<Label>{label}</Label>
			<ul className="space-y-1">
				{items.map((item, i) => (
					<li
						key={i}
						className="flex gap-2.5 text-foreground/80 text-sm leading-relaxed"
					>
						<span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
						<span>{cap(item) ?? ""}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

function AgentContent({
	agent,
	data,
	animate,
}: {
	agent: string;
	data: unknown;
	animate: boolean;
}) {
	const d = data as Record<string, Record<string, unknown>>;
	const payload = d[agent];

	if (agent === "parser_agent" && payload) {
		if (typeof payload.validationError === "string") {
			return (
				<BlurFade duration={0.3}>
					<p className="text-muted-foreground text-sm">
						{payload.validationError}
					</p>
				</BlurFade>
			);
		}
		const idea = payload.parsedIdea as Record<string, string> | undefined;
		if (!idea) return null;
		return (
			<BlurFade duration={0.3}>
				<div className="space-y-3">
					<Field label="Problem" value={idea.problem} />
					<Field label="Solution" value={idea.solution} />
					<Field label="Target audience" value={idea.targetAudience} />
					<div className="flex gap-8">
						<Field label="Domain" value={idea.techDomain} />
						<Field label="Category" value={idea.category} />
					</div>
				</div>
			</BlurFade>
		);
	}

	if (agent === "researcher_agent" && payload) {
		const r = payload.research as
			| {
					competitors?: { name: string; description: string; url?: string }[];
					marketContext?: string;
			  }
			| undefined;
		if (!r) return null;
		return (
			<BlurFade duration={0.3}>
				<div className="space-y-4">
					{r.competitors && r.competitors.length > 0 && (
						<div className="space-y-1.5">
							<Label>Competitors</Label>
							<div className="space-y-3">
								{r.competitors.map((c) => (
									<div key={c.name} className="space-y-0.5">
										<div className="flex items-center gap-2">
											<span className="font-medium text-sm">
												{cap(c.name) ?? ""}
											</span>
											{c.url && (
												<a
													href={c.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-muted-foreground text-xs underline underline-offset-2 transition-colors hover:text-foreground"
												>
													↗
												</a>
											)}
										</div>
										<span className="text-muted-foreground text-xs leading-relaxed">
											{cap(c.description) ?? ""}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
					{r.marketContext && (
						<Field
							label="Market context"
							value={
								r.marketContext.slice(0, 300) +
								(r.marketContext.length > 300 ? "…" : "")
							}
						/>
					)}
				</div>
			</BlurFade>
		);
	}

	if (agent === "critic_agent" && payload) {
		const c = payload.critique as
			| {
					weaknesses?: string[];
					risks?: string[];
					deadlyAssumptions?: string[];
			  }
			| undefined;
		if (!c) return null;
		return (
			<BlurFade duration={0.3}>
				<div className="space-y-4">
					{c.weaknesses && (
						<BulletList label="Weaknesses" items={c.weaknesses} />
					)}
					{c.risks && <BulletList label="Risks" items={c.risks} />}
					{c.deadlyAssumptions && (
						<BulletList
							label="Critical assumptions"
							items={c.deadlyAssumptions}
						/>
					)}
				</div>
			</BlurFade>
		);
	}

	if (agent === "opportunity_agent" && payload) {
		const o = payload.opportunities as
			| {
					strengths?: string[];
					opportunities?: string[];
					differentiators?: string[];
			  }
			| undefined;
		if (!o) return null;
		return (
			<BlurFade duration={0.3}>
				<div className="space-y-4">
					{o.strengths && <BulletList label="Strengths" items={o.strengths} />}
					{o.opportunities && (
						<BulletList label="Opportunities" items={o.opportunities} />
					)}
					{o.differentiators && (
						<BulletList label="Differentiators" items={o.differentiators} />
					)}
				</div>
			</BlurFade>
		);
	}

	if (agent === "feasibility_agent" && payload) {
		const f = payload.feasibility as
			| {
					complexity?: string;
					estimatedTimeline?: string;
					techStack?: string[];
					mainChallenges?: string[];
			  }
			| undefined;
		if (!f) return null;
		return (
			<BlurFade duration={0.3}>
				<div className="space-y-4">
					<div className="flex gap-8">
						{f.complexity && <Field label="Complexity" value={f.complexity} />}
						{f.estimatedTimeline && (
							<Field label="Timeline" value={f.estimatedTimeline} />
						)}
					</div>
					{f.techStack && f.techStack.length > 0 && (
						<div className="space-y-1.5">
							<Label>Tech stack</Label>
							<div className="flex flex-wrap gap-1.5">
								{f.techStack.map((t) => (
									<span
										key={t}
										className="rounded-md bg-secondary px-2 py-0.5 font-mono text-secondary-foreground text-xs"
									>
										{cap(t)}
									</span>
								))}
							</div>
						</div>
					)}
					{f.mainChallenges && (
						<BulletList label="Main challenges" items={f.mainChallenges} />
					)}
				</div>
			</BlurFade>
		);
	}

	if (agent === "synthesis_agent" && payload) {
		const s = payload.synthesis as
			| {
					overallScore?: number;
					verdict?: string;
					topRecommendations?: string[];
					summary?: string;
			  }
			| undefined;
		if (!s) return null;
		return (
			<BlurFade duration={0.3}>
				<div className="space-y-4">
					{s.overallScore !== undefined && (
						<div className="flex items-baseline gap-1.5">
							<span className="font-mono font-semibold text-3xl tabular-nums leading-none">
								<AnimatedScore value={s.overallScore} animate={animate} />
							</span>
							<span className="font-mono text-muted-foreground text-xs">
								/ 10
							</span>
						</div>
					)}
					{s.verdict && <Field label="Verdict" value={s.verdict} />}
					{s.summary && <Field label="Summary" value={s.summary} />}
					{s.topRecommendations && s.topRecommendations.length > 0 && (
						<BulletList label="Recommendations" items={s.topRecommendations} />
					)}
				</div>
			</BlurFade>
		);
	}

	return null;
}

function RunningSteps({
	steps,
	isComplete,
}: {
	steps: string[];
	isComplete: boolean;
}) {
	const [stepIndex, setStepIndex] = useState(0);

	useEffect(() => {
		if (isComplete) return;
		const timers = [
			setTimeout(() => setStepIndex(1), 1600),
			setTimeout(() => setStepIndex(2), 3200),
		];
		return () => timers.forEach(clearTimeout);
	}, [isComplete]);

	const effectiveStep = isComplete ? steps.length : stepIndex;

	return (
		<div className="space-y-2.5 py-0.5">
			{steps.map((step, i) => {
				const isDone = i < effectiveStep;
				const isActive = i === effectiveStep;
				return (
					<div
						key={i}
						className={`flex items-center gap-3 transition-opacity duration-300 ${
							!isDone && !isActive ? "opacity-25" : ""
						}`}
					>
						<span className="flex h-4 w-4 shrink-0 items-center justify-center">
							{isDone ? (
								<CheckIcon className="h-3 w-3 text-muted-foreground" />
							) : isActive ? (
								<span className="relative flex h-2 w-2">
									<span className="absolute inset-0 animate-ping rounded-full bg-foreground/60 opacity-75" />
									<span className="h-2 w-2 rounded-full bg-foreground/80" />
								</span>
							) : (
								<span className="h-1.5 w-1.5 rounded-full border border-muted-foreground/30" />
							)}
						</span>
						<span
							className={`text-sm transition-colors ${
								isDone
									? "text-muted-foreground"
									: isActive
										? "text-foreground"
										: "text-muted-foreground"
							}`}
						>
							{step}
						</span>
					</div>
				);
			})}
		</div>
	);
}

function AgentItem({ agent }: { agent: AgentState }) {
	const meta = AGENT_META[agent.name];
	const [expanded, setExpanded] = useState(false);
	const wasRunningWhenExpandedRef = useRef(false);

	const isPending = agent.status === "pending";
	const isRunning = agent.status === "running";
	const isComplete = agent.status === "complete";

	const shouldAnimateContent =
		isComplete &&
		(wasRunningWhenExpandedRef.current || !animatedAgents.has(agent.name));

	useEffect(() => {
		if (isComplete && expanded && shouldAnimateContent) {
			animatedAgents.add(agent.name);
		}
	}, [isComplete, expanded, shouldAnimateContent, agent.name]);

	if (!meta) return null;

	const { label, Icon, steps } = meta;
	const canExpand = isRunning || isComplete;

	const handleToggle = () => {
		if (!canExpand) return;
		if (!expanded && isRunning) {
			wasRunningWhenExpandedRef.current = true;
		}
		setExpanded((v) => !v);
	};

	return (
		<div className={isRunning ? "py-1" : ""}>
			<button
				type="button"
				onClick={handleToggle}
				className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors ${
					canExpand ? "cursor-pointer hover:bg-accent/50" : "cursor-default"
				} ${isPending ? "opacity-35" : ""}`}
				disabled={isPending}
			>
				{/* Status indicator */}
				<span className="flex h-5 w-5 shrink-0 items-center justify-center">
					{isPending && (
						<span className="h-2 w-2 rounded-full border border-muted-foreground/40" />
					)}
					{isRunning && (
						<span className="relative flex h-3 w-3">
							<span className="absolute inset-0 animate-ping rounded-full bg-foreground/50 opacity-75" />
							<span className="h-3 w-3 rounded-full bg-foreground/90" />
						</span>
					)}
					{isComplete && (
						<CheckIcon className="h-4 w-4 text-muted-foreground/60" />
					)}
				</span>

				{/* Icon with pulse animation when running */}
				<span
					className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
						isRunning ? "animate-pulse bg-foreground/10" : ""
					} ${isPending ? "text-muted-foreground/40" : "text-muted-foreground"}`}
				>
					<Icon className="h-4 w-4" />
				</span>

				{/* Label with pulse when running */}
				<span
					className={`flex-1 font-medium text-sm ${
						isRunning
							? "animate-pulse text-foreground"
							: isComplete
								? "text-foreground/70"
								: "text-muted-foreground"
					}`}
				>
					{label}
				</span>

				{/* Expand chevron */}
				{canExpand && (
					<ChevronRightIcon
						className={`h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform duration-200 ${
							expanded ? "rotate-90" : ""
						}`}
					/>
				)}
			</button>

			{/* Expanded content */}
			{expanded && canExpand && (
				<div className="ml-[3.5rem] pr-4 pb-4">
					{isRunning && <RunningSteps steps={steps} isComplete={false} />}
					{isComplete && (
						<BlurFade delay={0.1} duration={0.4}>
							<AgentContent
								agent={agent.name}
								data={agent.data}
								animate={shouldAnimateContent}
							/>
						</BlurFade>
					)}
				</div>
			)}
		</div>
	);
}

function RunningStepsOrContent({
	agent,
	data,
	steps,
	animate,
	hadRunningPhase,
}: {
	agent: string;
	data: unknown;
	steps: string[];
	animate: boolean;
	hadRunningPhase: boolean;
}) {
	const [showContent, setShowContent] = useState(!hadRunningPhase);

	useEffect(() => {
		if (!hadRunningPhase) return;
		const timer = setTimeout(() => setShowContent(true), 300);
		return () => clearTimeout(timer);
	}, [hadRunningPhase]);

	if (!showContent) {
		return <RunningSteps steps={steps} isComplete={true} />;
	}

	return <AgentContent agent={agent} data={data} animate={animate} />;
}

export function AgentAccordion({ agents }: { agents: AgentState[] }) {
	if (agents.length === 0) return null;

	const doneCount = agents.filter((a) => a.status === "complete").length;

	return (
		<div className="space-y-2">
			<div className="mb-3 flex items-center justify-between px-4">
				<span className="font-mono text-[11px] text-muted-foreground/50 uppercase tracking-widest">
					Agents
				</span>
				<span className="font-mono text-[11px] text-muted-foreground/50">
					{doneCount}/{agents.length}
				</span>
			</div>
			{agents.map((agent) => (
				<AgentItem key={agent.name} agent={agent} />
			))}
		</div>
	);
}
