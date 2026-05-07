"use client";

import { BlurFade } from "@lens/ui/components/blur-fade";
import {
	CheckCircle2,
	ChevronDown,
	Circle,
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

export interface AgentState {
	name: string;
	status: "pending" | "running" | "complete";
	data: unknown;
}

const AGENT_META: Record<
	string,
	{
		label: string;
		doneLabel: string;
		phrases: string[];
		Icon: React.ComponentType<{ className?: string }>;
	}
> = {
	parser: {
		label: "Idea Parser",
		doneLabel: "Idea parsed",
		phrases: [
			"Parsing your idea...",
			"Breaking it down...",
			"Identifying the core problem...",
			"Mapping the concept...",
		],
		Icon: Search,
	},
	researcher: {
		label: "Market Researcher",
		doneLabel: "Market researched",
		phrases: [
			"Searching the web...",
			"Looking for competitors...",
			"Gathering market data...",
			"Scanning the landscape...",
		],
		Icon: Globe,
	},
	critic: {
		label: "Risk Analyst",
		doneLabel: "Risks identified",
		phrases: [
			"Being skeptical...",
			"Finding weaknesses...",
			"Stress-testing assumptions...",
			"Playing devil's advocate...",
		],
		Icon: ShieldAlert,
	},
	opportunity: {
		label: "Opportunity Scout",
		doneLabel: "Opportunities found",
		phrases: [
			"Spotting opportunities...",
			"Finding your edge...",
			"Exploring market gaps...",
			"Looking for strengths...",
		],
		Icon: Lightbulb,
	},
	feasibility_agent: {
		label: "Feasibility Checker",
		doneLabel: "Feasibility assessed",
		phrases: [
			"Evaluating feasibility...",
			"Estimating complexity...",
			"Checking the tech stack...",
			"Assessing timelines...",
		],
		Icon: Wrench,
	},
	synthesis_agent: {
		label: "Synthesis Agent",
		doneLabel: "Analysis complete",
		phrases: [
			"Synthesizing findings...",
			"Cooking the insights...",
			"Writing the verdict...",
			"Putting it all together...",
		],
		Icon: Sparkles,
	},
};

function ThinkingPanel({ phrase }: { phrase: string }) {
	return (
		<div className="space-y-3 py-1">
			<div className="flex items-center gap-2">
				<div className="flex gap-1">
					<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.3s]" />
					<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.15s]" />
					<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40" />
				</div>
				<span
					key={phrase}
					className="fade-in animate-in text-muted-foreground text-xs duration-500"
				>
					{phrase}
				</span>
			</div>
			<div className="space-y-2.5">
				{[88, 72, 95, 60].map((w, i) => (
					<div
						key={i}
						className="h-2 animate-pulse rounded-full bg-muted"
						style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
					/>
				))}
			</div>
		</div>
	);
}

function Label({ children }: { children: React.ReactNode }) {
	return (
		<span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
			{children}
		</span>
	);
}

function Field({ label, value }: { label: string; value?: string }) {
	if (!value) return null;
	return (
		<div>
			<Label>{label}</Label>
			<p className="mt-0.5 text-sm leading-relaxed">{cap(value)}</p>
		</div>
	);
}

function BulletList({ label, items }: { label: string; items: string[] }) {
	return (
		<div>
			<Label>{label}</Label>
			<ul className="mt-1.5 space-y-1">
				{items.map((item, i) => (
					<li key={i} className="flex gap-2 text-sm leading-relaxed">
						<span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
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

	if (agent === "parser" && payload) {
		const idea = payload.parsedIdea as Record<string, string> | undefined;
		if (!idea) return null;
		return (
			<BlurFade duration={0.35}>
				<div className="space-y-3">
					<Field label="Problem" value={idea.problem} />
					<Field label="Solution" value={idea.solution} />
					<Field label="Target audience" value={idea.targetAudience} />
					<div className="flex gap-6">
						<Field label="Domain" value={idea.techDomain} />
						<Field label="Category" value={idea.category} />
					</div>
				</div>
			</BlurFade>
		);
	}

	if (agent === "researcher" && payload) {
		const r = payload.research as
			| {
					competitors?: { name: string; description: string; url?: string }[];
					marketContext?: string;
			  }
			| undefined;
		if (!r) return null;
		return (
			<BlurFade duration={0.35}>
				<div className="space-y-4">
					{r.competitors && r.competitors.length > 0 && (
						<div>
							<Label>Competitors</Label>
							<div className="mt-2 space-y-2">
								{r.competitors.map((c) => (
									<div key={c.name} className="flex flex-col">
										<span className="font-medium text-sm">{cap(c.name)}</span>
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
								(r.marketContext.length > 300 ? "..." : "")
							}
						/>
					)}
				</div>
			</BlurFade>
		);
	}

	if (agent === "critic" && payload) {
		const c = payload.critique as
			| {
					weaknesses?: string[];
					risks?: string[];
					deadlyAssumptions?: string[];
			  }
			| undefined;
		if (!c) return null;
		return (
			<BlurFade duration={0.35}>
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

	if (agent === "opportunity" && payload) {
		const o = payload.opportunities as
			| {
					strengths?: string[];
					opportunities?: string[];
					differentiators?: string[];
			  }
			| undefined;
		if (!o) return null;
		return (
			<BlurFade duration={0.35}>
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
			<BlurFade duration={0.35}>
				<div className="space-y-4">
					<div className="flex gap-8">
						{f.complexity && <Field label="Complexity" value={f.complexity} />}
						{f.estimatedTimeline && (
							<Field label="Timeline" value={f.estimatedTimeline} />
						)}
					</div>
					{f.techStack && f.techStack.length > 0 && (
						<div>
							<Label>Tech stack</Label>
							<div className="mt-2 flex flex-wrap gap-1.5">
								{f.techStack.map((t) => (
									<span
										key={t}
										className="rounded bg-secondary px-2 py-0.5 font-mono text-secondary-foreground text-xs"
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

	return null;
}

function AgentItem({ agent }: { agent: AgentState }) {
	const meta = AGENT_META[agent.name];
	const [expanded, setExpanded] = useState(false);
	const [phraseIndex, setPhraseIndex] = useState(0);

	const isPending = agent.status === "pending";
	const isRunning = agent.status === "running";
	const isComplete = agent.status === "complete";

	useEffect(() => {
		if (!isRunning || !meta) return;
		const id = setInterval(
			() => setPhraseIndex((i) => (i + 1) % meta.phrases.length),
			2500,
		);
		return () => clearInterval(id);
	}, [isRunning, meta]);

	useEffect(() => {
		if (isRunning) setExpanded(true);
	}, [isRunning]);

	if (!meta) return null;

	const { Icon, label, doneLabel, phrases } = meta;

	return (
		<div className="border-b last:border-b-0">
			<button
				type="button"
				className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/30 disabled:cursor-default disabled:opacity-40"
				onClick={() => !isPending && setExpanded((p) => !p)}
				disabled={isPending}
			>
				{/* Status dot */}
				<div className="flex h-4 w-4 shrink-0 items-center justify-center">
					{isPending && <Circle className="h-3 w-3 text-muted-foreground/30" />}
					{isRunning && (
						<span className="relative flex h-2.5 w-2.5">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
							<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
						</span>
					)}
					{isComplete && (
						<CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
					)}
				</div>

				{/* Agent icon */}
				<Icon
					className={`h-4 w-4 shrink-0 transition-colors ${isPending ? "text-muted-foreground/30" : "text-foreground"}`}
				/>

				{/* Label */}
				<div className="min-w-0 flex-1">
					{isPending && (
						<span className="text-muted-foreground/50 text-sm">{label}</span>
					)}
					{isRunning && (
						<span
							key={phraseIndex}
							className="fade-in block animate-in font-medium text-sm duration-500"
						>
							{phrases[phraseIndex]}
						</span>
					)}
					{isComplete && (
						<span className="font-medium text-sm">{doneLabel}</span>
					)}
				</div>

				{/* Chevron */}
				{!isPending && (
					<ChevronDown
						className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
					/>
				)}
			</button>

			{expanded && !isPending && (
				<div className="border-t bg-muted/20 px-11 py-4">
					{isRunning && <ThinkingPanel phrase={phrases[phraseIndex]} />}
					{isComplete && <AgentContent agent={agent.name} data={agent.data} />}
				</div>
			)}
		</div>
	);
}

export function AgentTimeline({ agents }: { agents: AgentState[] }) {
	if (agents.length === 0) return null;

	return (
		<div className="fade-in mt-6 w-full max-w-2xl animate-in rounded-lg border duration-300">
			{agents.map((agent) => (
				<AgentItem key={agent.name} agent={agent} />
			))}
		</div>
	);
}
