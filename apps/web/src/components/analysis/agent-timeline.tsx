"use client";

import { useState } from "react";

export interface AgentUpdate {
	agent: string;
	status: "running" | "complete";
	data: unknown;
	label: string;
}

const AGENT_META: Record<
	string,
	{ running: string; done: string; emoji: string }
> = {
	parser: {
		running: "Analyzing your idea...",
		done: "Idea analyzed",
		emoji: "🔍",
	},
	researcher: {
		running: "Searching the web...",
		done: "Market researched",
		emoji: "🌐",
	},
	critic: {
		running: "Identifying risks...",
		done: "Risks identified",
		emoji: "⚠️",
	},
	opportunity: {
		running: "Finding opportunities...",
		done: "Opportunities found",
		emoji: "💡",
	},
	feasibility_agent: {
		running: "Evaluating feasibility...",
		done: "Feasibility evaluated",
		emoji: "⚙️",
	},
	synthesis_agent: {
		running: "Synthesizing findings...",
		done: "Analysis complete",
		emoji: "✨",
	},
};

function AgentDataPreview({ agent, data }: { agent: string; data: unknown }) {
	const d = data as Record<string, Record<string, unknown>>;
	const payload = d[agent] ?? d[`${agent}`];

	if (agent === "parser" && payload) {
		const idea = payload.parsedIdea as Record<string, string> | undefined;
		if (idea) {
			return (
				<div className="space-y-2 text-sm">
					<p>
						<span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
							Problem
						</span>
						<br />
						{idea.problem}
					</p>
					<p>
						<span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
							Solution
						</span>
						<br />
						{idea.solution}
					</p>
					<p>
						<span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
							Target
						</span>
						<br />
						{idea.targetAudience}
					</p>
				</div>
			);
		}
	}

	if (agent === "researcher" && payload) {
		const research = payload.research as
			| {
					competitors?: { name: string; description: string }[];
					marketContext?: string;
			  }
			| undefined;
		if (research) {
			return (
				<div className="space-y-2 text-sm">
					{research.competitors && research.competitors.length > 0 && (
						<div>
							<span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
								Competitors ({research.competitors.length})
							</span>
							<ul className="mt-1 space-y-1">
								{research.competitors.slice(0, 3).map((c) => (
									<li key={c.name} className="truncate">
										<span className="font-medium">{c.name}</span> —{" "}
										<span className="text-muted-foreground text-xs">
											{c.description}
										</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			);
		}
	}

	if (agent === "critic" && payload) {
		const critique = payload.critique as
			| { weaknesses?: string[]; risks?: string[] }
			| undefined;
		if (critique) {
			return (
				<div className="space-y-2 text-sm">
					{critique.weaknesses && (
						<div>
							<span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
								Weaknesses
							</span>
							<ul className="mt-1 list-disc space-y-1 pl-4">
								{critique.weaknesses.slice(0, 3).map((w, i) => (
									<li key={i} className="text-xs">
										{w}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			);
		}
	}

	if (agent === "opportunity" && payload) {
		const opps = payload.opportunities as
			| { strengths?: string[]; opportunities?: string[] }
			| undefined;
		if (opps) {
			return (
				<div className="space-y-2 text-sm">
					{opps.strengths && (
						<div>
							<span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
								Strengths
							</span>
							<ul className="mt-1 list-disc space-y-1 pl-4">
								{opps.strengths.slice(0, 3).map((s, i) => (
									<li key={i} className="text-xs">
										{s}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			);
		}
	}

	if (agent === "feasibility_agent" && payload) {
		const feas = payload.feasibility as
			| {
					complexity?: string;
					estimatedTimeline?: string;
					techStack?: string[];
			  }
			| undefined;
		if (feas) {
			return (
				<div className="space-y-2 text-sm">
					<div className="flex gap-4">
						{feas.complexity && (
							<span>
								<span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
									Complexity{" "}
								</span>
								<span className="font-medium capitalize">{feas.complexity}</span>
							</span>
						)}
						{feas.estimatedTimeline && (
							<span>
								<span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
									Timeline{" "}
								</span>
								<span className="font-medium">{feas.estimatedTimeline}</span>
							</span>
						)}
					</div>
				</div>
			);
		}
	}

	return (
		<pre className="text-muted-foreground max-h-40 overflow-auto text-xs">
			{JSON.stringify(data, null, 2)}
		</pre>
	);
}

function AgentItem({ update }: { update: AgentUpdate }) {
	const [expanded, setExpanded] = useState(false);
	const meta = AGENT_META[update.agent] ?? {
		running: "Processing...",
		done: "Done",
		emoji: "•",
	};
	const isRunning = update.status === "running";

	return (
		<div
			className={`border-l-2 py-3 pl-4 transition-all duration-200 ${
				isRunning
					? "border-amber-500"
					: "hover:border-foreground/30 cursor-pointer border-green-500/70"
			}`}
			onClick={() => !isRunning && setExpanded((p) => !p)}
			role={!isRunning ? "button" : undefined}
		>
			<div className="flex items-center gap-2">
				{isRunning ? (
					<span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
				) : (
					<span className="text-green-500 text-sm">✓</span>
				)}

				<span
					className={`text-sm font-medium ${isRunning ? "text-amber-500" : ""}`}
				>
					{meta.emoji}{" "}
					{isRunning ? meta.running : meta.done}
				</span>

				{!isRunning && (
					<span className="text-muted-foreground ml-auto font-mono text-xs">
						{expanded ? "▲" : "▼"}
					</span>
				)}
			</div>

			{!isRunning && (
				<div
					className={`overflow-hidden transition-all duration-300 ${
						expanded ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0"
					}`}
				>
					<div className="text-foreground/80 rounded-md border p-3">
						<AgentDataPreview agent={update.agent} data={update.data} />
					</div>
				</div>
			)}
		</div>
	);
}

export function AgentTimeline({
	agents,
}: {
	agents: AgentUpdate[];
}) {
	if (agents.length === 0) return null;

	return (
		<div className="mt-6 w-full max-w-2xl space-y-1">
			{agents.map((update) => (
				<AgentItem key={update.agent} update={update} />
			))}
		</div>
	);
}
