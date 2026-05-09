"use client";

import { Button } from "@lens/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/utils/trpc";

function ScoreBadge({ score }: { score: number }) {
	const color =
		score >= 7
			? "bg-green-500/10 text-green-600 dark:text-green-400"
			: score >= 4
				? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
				: "bg-red-500/10 text-red-600 dark:text-red-400";
	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium font-mono text-sm ${color}`}
		>
			{score}/10
		</span>
	);
}

function RelativeDate({ date }: { date: Date }) {
	const now = Date.now();
	const diff = now - date.getTime();
	const mins = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	let label: string;
	if (mins < 1) label = "Just now";
	else if (mins < 60) label = `${mins}m ago`;
	else if (hours < 24) label = `${hours}h ago`;
	else if (days < 30) label = `${days}d ago`;
	else label = date.toLocaleDateString();

	return <span className="text-muted-foreground text-xs">{label}</span>;
}

function AnalysesList() {
	const { data: items } = useSuspenseQuery(
		trpc.dashboard.listAnalyses.queryOptions(),
	);

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
					<Lightbulb className="h-6 w-6 text-muted-foreground" />
				</div>
				<div>
					<p className="font-medium">No analyses yet</p>
					<p className="mt-1 text-muted-foreground text-sm">
						Submit an idea to get started.
					</p>
				</div>
				<Button asChild variant="outline" size="sm">
					<Link href="/">Start your first analysis →</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="divide-y rounded-xl border bg-card">
			{items.map((item) => {
				const synthesis = item.synthesis as {
					overallScore?: number;
					verdict?: string;
				} | null;
				return (
					<Link
						key={item.id}
						href={`/dashboard/${item.id}`}
						className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30"
					>
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium text-sm leading-snug">
								{item.rawIdea.slice(0, 120)}
								{item.rawIdea.length > 120 && "…"}
							</p>
							{synthesis?.verdict && (
								<p className="mt-0.5 truncate text-muted-foreground text-xs">
									{synthesis.verdict.slice(0, 100)}
									{synthesis.verdict.length > 100 && "…"}
								</p>
							)}
						</div>
						<div className="flex shrink-0 items-center gap-3">
							{synthesis?.overallScore !== undefined && (
								<ScoreBadge score={synthesis.overallScore} />
							)}
							<RelativeDate date={new Date(item.createdAt)} />
							<ArrowRight className="h-4 w-4 text-muted-foreground" />
						</div>
					</Link>
				);
			})}
		</div>
	);
}

export default function DashboardPage() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-10">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl tracking-tight">My Analyses</h1>
					<p className="mt-1 text-muted-foreground text-sm">
						Your past idea analyses
					</p>
				</div>
				<Button asChild size="sm">
					<Link href="/">
						<Lightbulb className="mr-2 h-4 w-4" />
						New Analysis
					</Link>
				</Button>
			</div>
			<AnalysesList />
		</div>
	);
}
