"use client";

import {
	Globe,
	Lightbulb,
	Search,
	ShieldAlert,
	Sparkles,
	Wrench,
} from "lucide-react";

const cap = (s?: string) =>
	s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined;

function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
			{children}
		</span>
	);
}

function Field({ label, value }: { label: string; value?: string }) {
	if (!value) return null;
	return (
		<div className="space-y-0.5">
			<SectionLabel>{label}</SectionLabel>
			<p className="text-foreground/80 text-sm leading-relaxed">{cap(value)}</p>
		</div>
	);
}

function BulletList({ label, items }: { label: string; items: string[] }) {
	if (!items.length) return null;
	return (
		<div className="space-y-1.5">
			<SectionLabel>{label}</SectionLabel>
			<ul className="space-y-1.5">
				{items.map((item, i) => (
					<li
						key={i}
						className="flex gap-2.5 text-foreground/80 text-sm leading-relaxed"
					>
						<span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
						{cap(item)}
					</li>
				))}
			</ul>
		</div>
	);
}

const SECTIONS = [
	{
		key: "parser_agent",
		label: "Parsed idea",
		Icon: Search,
		render(payload: Record<string, unknown>) {
			const idea = payload.parsedIdea as Record<string, string> | undefined;
			if (!idea) return null;
			return (
				<div className="space-y-4">
					<Field label="Problem" value={idea.problem} />
					<Field label="Solution" value={idea.solution} />
					<Field label="Target audience" value={idea.targetAudience} />
					<div className="flex gap-8">
						<Field label="Domain" value={idea.techDomain} />
						<Field label="Category" value={idea.category} />
					</div>
				</div>
			);
		},
	},
	{
		key: "researcher_agent",
		label: "Market research",
		Icon: Globe,
		render(payload: Record<string, unknown>) {
			const r = payload.research as
				| {
						competitors?: { name: string; description: string; url?: string }[];
						marketContext?: string;
				  }
				| undefined;
			if (!r) return null;
			return (
				<div className="space-y-4">
					{r.competitors && r.competitors.length > 0 && (
						<div className="space-y-1.5">
							<SectionLabel>Competitors</SectionLabel>
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
										<p className="text-muted-foreground text-xs leading-relaxed">
											{cap(c.description)}
										</p>
									</div>
								))}
							</div>
						</div>
					)}
					{r.marketContext && (
						<Field
							label="Market context"
							value={
								r.marketContext.slice(0, 400) +
								(r.marketContext.length > 400 ? "…" : "")
							}
						/>
					)}
				</div>
			);
		},
	},
	{
		key: "critic_agent",
		label: "Risk analysis",
		Icon: ShieldAlert,
		render(payload: Record<string, unknown>) {
			const c = payload.critique as
				| {
						weaknesses?: string[];
						risks?: string[];
						deadlyAssumptions?: string[];
				  }
				| undefined;
			if (!c) return null;
			return (
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
			);
		},
	},
	{
		key: "opportunity_agent",
		label: "Opportunities",
		Icon: Lightbulb,
		render(payload: Record<string, unknown>) {
			const o = payload.opportunities as
				| {
						strengths?: string[];
						opportunities?: string[];
						differentiators?: string[];
				  }
				| undefined;
			if (!o) return null;
			return (
				<div className="space-y-4">
					{o.strengths && <BulletList label="Strengths" items={o.strengths} />}
					{o.opportunities && (
						<BulletList label="Opportunities" items={o.opportunities} />
					)}
					{o.differentiators && (
						<BulletList label="Differentiators" items={o.differentiators} />
					)}
				</div>
			);
		},
	},
	{
		key: "feasibility_agent",
		label: "Feasibility",
		Icon: Wrench,
		render(payload: Record<string, unknown>) {
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
				<div className="space-y-4">
					<div className="flex gap-8">
						{f.complexity && <Field label="Complexity" value={f.complexity} />}
						{f.estimatedTimeline && (
							<Field label="Timeline" value={f.estimatedTimeline} />
						)}
					</div>
					{f.techStack && f.techStack.length > 0 && (
						<div className="space-y-1.5">
							<SectionLabel>Tech stack</SectionLabel>
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
			);
		},
	},
	{
		key: "synthesis_agent",
		label: "Synthesis",
		Icon: Sparkles,
		render(payload: Record<string, unknown>) {
			const s = payload.synthesis as
				| {
						overallScore?: number;
						verdict?: string;
						summary?: string;
						topRecommendations?: string[];
				  }
				| undefined;
			if (!s) return null;
			return (
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
			);
		},
	},
] as const;

interface AgentResultsProps {
	agentData: Record<string, Record<string, unknown>> | null;
	parsedIdea?: Record<string, unknown> | null;
	synthesis?: {
		overallScore: number;
		verdict: string;
		summary: string;
		topRecommendations: string[];
	} | null;
}

export function AgentResults({
	agentData,
	parsedIdea,
	synthesis,
}: AgentResultsProps) {
	// Build a unified data object — agentData from DB is primary, fall back to individual columns
	const data: Record<string, Record<string, unknown>> = {
		...(agentData ?? {}),
	};
	if (!data.parser_agent && parsedIdea) {
		data.parser_agent = { parsedIdea };
	}
	if (!data.synthesis_agent && synthesis) {
		data.synthesis_agent = { synthesis };
	}

	return (
		<div className="space-y-6">
			{SECTIONS.map(({ key, label, Icon }) => {
				const payload = data[key];
				if (!payload) return null;
				const content = SECTIONS.find((s) => s.key === key)?.render(
					payload as Record<string, unknown>,
				);
				if (!content) return null;
				return (
					<div
						key={key}
						className="rounded-2xl border border-border/40 bg-card/50 p-5"
					>
						<div className="mb-4 flex items-center gap-2.5">
							<Icon className="h-4 w-4 shrink-0 text-muted-foreground/60" />
							<h3 className="font-medium text-sm">{label}</h3>
						</div>
						{content}
					</div>
				);
			})}
		</div>
	);
}
