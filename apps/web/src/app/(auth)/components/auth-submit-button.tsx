import { ArrowPathIcon } from "@heroicons/react/24/outline";

export const AuthSubmitButton = ({
	isDisabled,
	isLoading,
	loadingLabel,
	idleLabel,
}: {
	isDisabled: boolean;
	isLoading: boolean;
	loadingLabel: string;
	idleLabel: string;
}) => (
	<button
		type="submit"
		className="mt-2 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-foreground font-medium text-background text-sm transition-all hover:bg-foreground/90 disabled:opacity-60"
		disabled={isDisabled}
	>
		{isLoading ? (
			<>
				<ArrowPathIcon className="h-4 w-4 animate-spin" />
				{loadingLabel}
			</>
		) : (
			idleLabel
		)}
	</button>
);
