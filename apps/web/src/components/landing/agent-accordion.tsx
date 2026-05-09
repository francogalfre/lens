"use client";

import { BlurFade } from "@lens/ui/components/blur-fade";
import {
	Check,
	ChevronRight,
	Globe,
	Lightbulb,
	Search,
	ShieldAlert,
	Sparkles,
	Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";

const cap = (s?: string): string | undefined =>
	s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined;

export interface AgentMessage {
	type: "status" | "complete" | "error";
	text: string;
}

export interface AgentState {
	name: string;
	status: "pending" | "running" | "complete";
	data: unknown;
	messages?: AgentMessage[];
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
		Icon: Search,
		steps: [
			"Extracting core problem…",
			"Identifying target audience…",
			"Categorizing domain…",
		],
	},
	researcher_agent: {
		label: "Market researcher",
		Icon: Globe,
		steps: [
			"Querying market data…",
			"Scanning competitors…",
			"Analyzing trends…",
		],
	},
	critic_agent: {
		label: "Risk analyst",
		Icon: ShieldAlert,
		steps: [
			"Testing assumptions…",
			"Mapping risk vectors…",
			"Identifying weak points…",
		],
	},
	opportunity_agent: {
		label: "Opportunity scout",
		Icon: Lightbulb,
		steps: [
			"Scanning market gaps…",
			"Finding differentiators…",
			"Mapping growth vectors…",
		],
	},
	feasibility_agent: {
		label: "Feasibility checker",
		Icon: Wrench,
		steps: [
			"Evaluating complexity…",
			"Assessing tech stack…",
			"Estimating timeline…",
		],
	},
	synthesis_agent: {
		label: "Synthesis",
		Icon: Sparkles,
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
	return (
		<div className="space-y-0.5">
			<Label>{label}</Label>
			<p className="text-foreground/80 text-sm leading-relaxed">{cap(value)}</p>
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
						{cap(item)}
					</li>
				))}
			</ul>
		</div>
	);
}

function AgentContent({ agent, data }: { agent: string; data: unknown }) {
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
											<span className="font-medium text-sm">{cap(c.name)}</span>
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
											{cap(c.description)}
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
							<span className="font-mono font-semibold text-3xl leading-none">
								{s.overallScore}
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
								<Check className="h-3 w-3 text-muted-foreground" />
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

	const isPending = agent.status === "pending";
	const isRunning = agent.status === "running";
	const isComplete = agent.status === "complete";

	if (!meta) return null;

	const { label, Icon, steps } = meta;
	const canExpand = isRunning || isComplete;

	return (
		<div>
			<button
				type="button"
				onClick={() => canExpand && setExpanded((v) => !v)}
				className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
					canExpand ? "cursor-pointer hover:bg-accent/50" : "cursor-default"
				} ${isPending ? "opacity-35" : ""}`}
				disabled={isPending}
			>
				{/* Status indicator */}
				<span className="flex h-4 w-4 shrink-0 items-center justify-center">
					{isPending && (
						<span className="h-1.5 w-1.5 rounded-full border border-muted-foreground/40" />
					)}
					{isRunning && (
						<span className="relative flex h-2 w-2">
							<span className="absolute inset-0 animate-ping rounded-full bg-foreground/50 opacity-75" />
							<span className="h-2 w-2 rounded-full bg-foreground/90" />
						</span>
					)}
					{isComplete && (
						<Check className="h-3.5 w-3.5 text-muted-foreground/60" />
					)}
				</span>

				{/* Icon */}
				<Icon
					className={`h-4 w-4 shrink-0 ${isPending ? "text-muted-foreground/40" : "text-muted-foreground"}`}
				/>

				{/* Label */}
				<span
					className={`flex-1 text-sm ${isComplete ? "text-foreground/70" : isRunning ? "text-foreground" : "text-muted-foreground"}`}
				>
					{label}
				</span>

				{/* Expand chevron */}
				{canExpand && (
					<ChevronRight
						className={`h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-transform duration-200 ${
							expanded ? "rotate-90" : ""
						}`}
					/>
				)}
			</button>

			{/* Expanded content */}
			{expanded && canExpand && (
				<div className="ml-[2.75rem] pt-1 pr-3 pb-2">
					{isRunning && <RunningSteps steps={steps} isComplete={false} />}
					{isComplete && (
						<RunningStepsOrContent
							agent={agent.name}
							data={agent.data}
							steps={steps}
						/>
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
}: {
	agent: string;
	data: unknown;
	steps: string[];
}) {
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setShowContent(true), 400);
		return () => clearTimeout(timer);
	}, []);

	if (!showContent) {
		return <RunningSteps steps={steps} isComplete={true} />;
	}

	return <AgentContent agent={agent} data={data} />;
}

export function AgentAccordion({ agents }: { agents: AgentState[] }) {
	if (agents.length === 0) return null;

	const doneCount = agents.filter((a) => a.status === "complete").length;

	return (
		<div className="space-y-0.5">
			<div className="mb-3 flex items-center justify-between px-3">
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
