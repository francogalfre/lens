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
		doneLabel: string;
		phrases: string[];
		Icon: React.ComponentType<{ className?: string }>;
	}
> = {
	parser_agent: {
		label: "Idea Parser",
		doneLabel: "Idea parsed",
		phrases: ["Parsing your idea...", "Breaking it down..."],
		Icon: Search,
	},
	researcher_agent: {
		label: "Market Researcher",
		doneLabel: "Market researched",
		phrases: ["Searching the web...", "Gathering market data..."],
		Icon: Globe,
	},
	critic_agent: {
		label: "Risk Analyst",
		doneLabel: "Risks identified",
		phrases: ["Analyzing weaknesses...", "Evaluating risks..."],
		Icon: ShieldAlert,
	},
	opportunity_agent: {
		label: "Opportunity Scout",
		doneLabel: "Opportunities found",
		phrases: ["Finding opportunities...", "Exploring gaps..."],
		Icon: Lightbulb,
	},
	feasibility_agent: {
		label: "Feasibility Checker",
		doneLabel: "Feasibility assessed",
		phrases: ["Evaluating feasibility...", "Assessing complexity..."],
		Icon: Wrench,
	},
	synthesis_agent: {
		label: "Synthesis Agent",
		doneLabel: "Analysis complete",
		phrases: ["Synthesizing findings...", "Writing verdict..."],
		Icon: Sparkles,
	},
};

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

	if (agent === "parser_agent" && payload) {
		if (typeof payload.validationError === "string") {
			return (
				<BlurFade duration={0.35}>
					<p className="text-muted-foreground text-sm">
						{payload.validationError}
					</p>
				</BlurFade>
			);
		}
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

	if (agent === "researcher_agent" && payload) {
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
									<div key={c.name} className="flex flex-col gap-0.5">
										<div className="flex items-center gap-2">
											<span className="font-medium text-sm">{cap(c.name)}</span>
											{c.url && (
												<a
													href={c.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-muted-foreground text-xs underline underline-offset-2 transition-colors hover:text-foreground"
												>
													Visit ↗
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
								(r.marketContext.length > 300 ? "..." : "")
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
			<BlurFade duration={0.35}>
				<div className="space-y-4">
					{s.overallScore !== undefined && (
						<div className="flex items-baseline gap-2">
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

	if (!meta) return null;

	const { label, phrases } = meta;

	return (
		<div className="group border-border/60 border-b last:border-b-0">
			<button
				type="button"
				onClick={() => !isPending && setExpanded(!expanded)}
				className={`flex w-full items-center gap-4 px-4 py-4 text-left transition-colors ${
					isPending ? "opacity-50" : "hover:bg-muted/30"
				}`}
				disabled={isPending}
			>
				<div className="shrink-0">
					{isPending && <Circle className="h-5 w-5 text-muted-foreground/30" />}
					{isRunning && (
						<span className="relative flex h-5 w-5">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/40 opacity-75" />
							<span className="relative inline-flex h-5 w-5 rounded-full bg-red-500" />
						</span>
					)}
					{isComplete && <CheckCircle2 className="h-5 w-5 text-green-500" />}
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="font-medium text-foreground">{label}</span>
						{isComplete && (
							<span className="rounded-full bg-green-500/10 px-2 py-0.5 font-medium text-green-600 text-xs">
								Done
							</span>
						)}
						{isRunning && (
							<span className="rounded-full bg-red-500/10 px-2 py-0.5 font-medium text-red-600 text-xs">
								Running
							</span>
						)}
					</div>
				</div>

				{!isPending && (
					<ChevronDown
						className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
							expanded ? "rotate-180" : ""
						}`}
					/>
				)}
			</button>

			{expanded && (
				<div className="px-4 pb-4 pl-[4.5rem]">
					<div className="border-t pt-4">
						{isRunning && (
							<div className="flex items-start gap-3">
								<span className="mt-1 flex h-2 w-2 shrink-0 items-center justify-center">
									<span className="relative flex h-2 w-2">
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
										<span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
									</span>
								</span>
								<p className="animate-pulse text-muted-foreground text-sm">
									{phrases[phraseIndex]}
								</p>
							</div>
						)}
						{isComplete && (
							<AgentContent agent={agent.name} data={agent.data} />
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export function AgentAccordion({ agents }: { agents: AgentState[] }) {
	if (agents.length === 0) return null;

	return (
		<div className="rounded-xl border bg-card">
			<div className="border-b px-4 py-3">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-lg">Analysis Agents</h2>
					<span className="font-mono text-muted-foreground text-sm">
						{agents.filter((a) => a.status === "complete").length}/
						{agents.length}
					</span>
				</div>
			</div>
			<div>
				{agents.map((agent) => (
					<AgentItem key={agent.name} agent={agent} />
				))}
			</div>
		</div>
	);
}
