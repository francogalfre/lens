"use client";

import {
	ArrowRightIcon,
	PlusIcon,
	SparklesIcon,
} from "@heroicons/react/24/outline";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { trpc } from "@/lib/trpc";
import { RelativeDate } from "./components/relative-date";
import { ScoreBadge } from "./components/score-badge";

function formatDateGroup(dateStr: string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);

	const isSameDay = (d1: Date, d2: Date) =>
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate();

	if (isSameDay(date, now)) return "Today";
	if (isSameDay(date, yesterday)) return "Yesterday";

	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
	});
}

function AnalysesList() {
	const { data: items } = useSuspenseQuery(
		trpc.dashboard.listAnalyses.queryOptions(),
	);

	const itemsList = items as Array<{
		id: string;
		rawIdea: string;
		synthesis: unknown;
		createdAt: string;
	}>;

	if (itemsList.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-card/40 px-6 py-20 text-center"
			>
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
					<SparklesIcon
						className="h-5 w-5 text-foreground/55"
						strokeWidth={1.75}
					/>
				</div>
				<div className="space-y-1.5">
					<p className="font-medium text-foreground">No analyses yet</p>
					<p className="text-foreground/55 text-sm">
						Submit an idea to get started.
					</p>
				</div>
				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 font-medium text-background text-xs transition-all hover:scale-[1.02] hover:bg-foreground/90"
				>
					<PlusIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
					Start your first analysis
				</Link>
			</motion.div>
		);
	}

	const groupedItems = itemsList.reduce<Record<string, typeof itemsList>>(
		(acc, item) => {
			const dateKey = new Date(item.createdAt).toDateString();
			if (!acc[dateKey]) acc[dateKey] = [];
			acc[dateKey].push(item);
			return acc;
		},
		{},
	);

	const sortedDates = Object.keys(groupedItems).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime(),
	);

	return (
		<div className="space-y-8">
			{sortedDates.map((dateKey) => {
				const groupItems = groupedItems[dateKey];
				const dateLabel = formatDateGroup(groupItems[0].createdAt);
				return (
					<div key={dateKey}>
						<div className="mb-3 flex items-center gap-3 px-1">
							<span className="font-mono text-[11px] text-muted-foreground/50 uppercase tracking-widest">
								{dateLabel}
							</span>
							<span className="h-px flex-1 bg-border/50" />
							<span className="font-mono text-[10px] text-muted-foreground/30">
								{groupItems.length}
							</span>
						</div>
						<div className="overflow-hidden rounded-2xl border border-border bg-card/40">
							{groupItems.map((item, i) => {
								const synthesis = item.synthesis as {
									overallScore?: number;
									verdict?: string;
								} | null;
								return (
									<motion.div
										key={item.id}
										initial={{ opacity: 0, y: 8 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.4,
											delay: i * 0.03,
											ease: [0.22, 1, 0.36, 1],
										}}
									>
										<Link
											href={`/dashboard/${item.id}`}
											className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-foreground/[0.02] ${
												i > 0 ? "border-border/60 border-t" : ""
											}`}
										>
											<div className="min-w-0 flex-1">
												<p className="truncate font-medium text-[15px] text-foreground leading-snug tracking-tight">
													{item.rawIdea.slice(0, 120)}
													{item.rawIdea.length > 120 && "…"}
												</p>
												{synthesis?.verdict && (
													<p className="mt-1 truncate text-foreground/55 text-xs leading-relaxed">
														{synthesis.verdict.slice(0, 110)}
														{synthesis.verdict.length > 110 && "…"}
													</p>
												)}
											</div>
											<div className="flex shrink-0 items-center gap-3">
												{synthesis?.overallScore !== undefined && (
													<ScoreBadge score={synthesis.overallScore} />
												)}
												<RelativeDate date={new Date(item.createdAt)} />
												<ArrowRightIcon className="h-4 w-4 text-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-foreground/60" />
											</div>
										</Link>
									</motion.div>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default function DashboardPage() {
	return (
		<>
			<div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="mb-10 flex items-end justify-between gap-4"
				>
					<div>
						<h1 className="font-medium text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
							Your analyses
						</h1>
						<p className="mt-1.5 text-foreground/55 text-sm">
							A running log of every idea you&apos;ve put under the lens.
						</p>
					</div>
					<Link
						href="/"
						className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 font-medium text-background text-xs transition-all hover:scale-[1.02] hover:bg-foreground/90"
					>
						<PlusIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
						<span className="hidden sm:inline">New analysis</span>
						<span className="sm:hidden">New</span>
					</Link>
				</motion.div>

				<AnalysesList />
			</div>
			<Footer />
		</>
	);
}
