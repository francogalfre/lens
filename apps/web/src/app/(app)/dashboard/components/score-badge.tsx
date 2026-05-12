interface ScoreBadgeProps {
	score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
	return (
		<span className="inline-flex items-baseline gap-0.5 tabular-nums">
			<span className="font-medium text-foreground text-sm">{score}</span>
			<span className="text-[11px] text-foreground/35">/10</span>
		</span>
	);
}
