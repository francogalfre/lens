"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { AnalysesEmptyState } from "@/app/(app)/dashboard/components/analyses-empty-state";
import { AnalysisListItem } from "@/app/(app)/dashboard/components/analysis-list-item";
import { formatDateGroup } from "@/app/(app)/dashboard/utils/format-date-group";
import { trpc } from "@/lib/trpc";

type AnalysisItem = {
	id: string;
	rawIdea: string;
	synthesis: unknown;
	createdAt: string;
};

const groupByDate = (items: AnalysisItem[]) =>
	items.reduce<Record<string, AnalysisItem[]>>((accumulator, item) => {
		const dateKey = new Date(item.createdAt).toDateString();
		if (!accumulator[dateKey]) accumulator[dateKey] = [];
		accumulator[dateKey].push(item);
		return accumulator;
	}, {});

const DateGroupHeader = ({
	dateLabel,
	count,
}: {
	dateLabel: string;
	count: number;
}) => (
	<div className="mb-3 flex items-center gap-3 px-1">
		<span className="font-mono text-[11px] text-muted-foreground/50 uppercase tracking-widest">
			{dateLabel}
		</span>
		<span className="h-px flex-1 bg-border/50" />
		<span className="font-mono text-[10px] text-muted-foreground/30">
			{count}
		</span>
	</div>
);

export const AnalysesList = () => {
	const { data } = useSuspenseQuery(trpc.dashboard.listAnalyses.queryOptions());
	const items = data as AnalysisItem[];

	if (items.length === 0) return <AnalysesEmptyState />;

	const groupedItems = groupByDate(items);
	const sortedDates = Object.keys(groupedItems).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime(),
	);

	return (
		<div className="space-y-8">
			{sortedDates.map((dateKey) => {
				const groupItems = groupedItems[dateKey];
				return (
					<div key={dateKey}>
						<DateGroupHeader
							dateLabel={formatDateGroup(groupItems[0].createdAt)}
							count={groupItems.length}
						/>
						<div className="overflow-hidden rounded-2xl border border-border bg-card/40">
							{groupItems.map((analysis, index) => (
								<AnalysisListItem
									key={analysis.id}
									analysis={analysis}
									index={index}
									withTopBorder={index > 0}
								/>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
};
