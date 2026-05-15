interface RelativeDateProps {
	date: Date;
}

export function RelativeDate({ date }: RelativeDateProps) {
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
