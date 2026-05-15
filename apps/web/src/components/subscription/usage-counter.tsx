export const UsageCounter = ({
	used,
	limit,
}: {
	used: number;
	limit: number;
}) => {
	const isFull = used >= limit;
	return (
		<span
			aria-hidden
			className={`flex h-6 items-center justify-center rounded-full px-2 font-mono tabular-nums ${
				isFull
					? "bg-destructive/10 text-destructive"
					: "bg-foreground/5 text-foreground/70"
			}`}
		>
			{used}/{limit}
		</span>
	);
};
