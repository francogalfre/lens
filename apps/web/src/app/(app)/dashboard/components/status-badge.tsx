import { ClockIcon } from "@heroicons/react/24/outline";

export function InProgressBadge() {
	return (
		<span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-[10px] text-amber-700 uppercase tracking-wider dark:text-amber-400">
			<ClockIcon className="h-2.5 w-2.5" />
			In progress
		</span>
	);
}
