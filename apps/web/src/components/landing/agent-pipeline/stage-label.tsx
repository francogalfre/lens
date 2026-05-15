export const StageLabel = ({
	index,
	text,
	active,
}: {
	index: number;
	text: string;
	active: boolean;
}) => (
	<div className="flex items-center justify-center gap-2 text-center">
		<span
			className={`text-xs tabular-nums transition-colors duration-500 ${
				active ? "text-foreground" : "text-muted-foreground/60"
			}`}
		>
			<span className="text-foreground/40">
				{String(index).padStart(2, "0")}
			</span>
			<span className="mx-1.5 text-foreground/25">/</span>
			<span className="font-medium">{text}</span>
		</span>
	</div>
);

export const MobileStageLabel = ({
	text,
	active,
}: {
	text: string;
	active: boolean;
}) => (
	<span
		className={`text-[10px] tabular-nums transition-colors duration-500 ${
			active ? "text-foreground" : "text-muted-foreground/60"
		}`}
	>
		{text}
	</span>
);
