import { ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";

export const ActivePlanBadge = () => (
	<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-medium text-[10px] text-emerald-600 uppercase tracking-wider dark:text-emerald-400">
		<SparklesIcon className="h-2.5 w-2.5" />
		Active
	</span>
);

export const CancellingPlanBadge = ({ endDate }: { endDate: string }) => (
	<span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-medium text-[10px] text-amber-600 uppercase tracking-wider dark:text-amber-400">
		<ClockIcon className="h-2.5 w-2.5" />
		Cancels {endDate}
	</span>
);
