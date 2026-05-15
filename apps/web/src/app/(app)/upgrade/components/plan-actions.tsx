import { ArrowPathIcon } from "@heroicons/react/24/outline";

export const SubscribeButton = ({
	onClick,
	isPending,
}: {
	onClick: () => void;
	isPending: boolean;
}) => (
	<button
		type="button"
		onClick={onClick}
		disabled={isPending}
		className="mt-7 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-foreground font-medium text-background text-sm transition-all hover:bg-foreground/90 disabled:opacity-60"
	>
		{isPending ? (
			<>
				<ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
				Redirecting…
			</>
		) : (
			"Subscribe now"
		)}
	</button>
);

export const CancelButton = ({
	onClick,
	isPending,
}: {
	onClick: () => void;
	isPending: boolean;
}) => (
	<button
		type="button"
		onClick={onClick}
		disabled={isPending}
		className="mt-7 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-border bg-card/60 font-medium text-foreground/80 text-sm transition-all hover:bg-destructive/5 hover:text-destructive disabled:opacity-60"
	>
		{isPending ? (
			<>
				<ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
				Cancelling…
			</>
		) : (
			"Cancel plan"
		)}
	</button>
);
