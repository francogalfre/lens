export const capitalize = (text?: string): string | undefined =>
	text ? text.charAt(0).toUpperCase() + text.slice(1) : undefined;

export const Label = ({ children }: { children: React.ReactNode }) => (
	<span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
		{children}
	</span>
);

export const Field = ({ label, value }: { label: string; value?: string }) => {
	if (!value) return null;
	const text = capitalize(value) ?? "";
	return (
		<div className="space-y-0.5">
			<Label>{label}</Label>
			<p className="text-foreground/80 text-sm leading-relaxed">{text}</p>
		</div>
	);
};

export const BulletList = ({
	label,
	items,
}: {
	label: string;
	items: string[];
}) => (
	<div className="space-y-1.5">
		<Label>{label}</Label>
		<ul className="space-y-1">
			{items.map((item, index) => (
				<li
					key={index}
					className="flex gap-2.5 text-foreground/80 text-sm leading-relaxed"
				>
					<span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
					<span>{capitalize(item) ?? ""}</span>
				</li>
			))}
		</ul>
	</div>
);
