"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { Suspense, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { CancelPlanDialog } from "./cancel-plan-dialog";

interface SubscriptionStatus {
	usedToday: number;
	limit: number;
	plan: "free" | "premium";
	cancelAtPeriodEnd: boolean;
	currentPeriodEnd: string | null;
}

function formatEndDate(iso: string | null): string {
	if (!iso) return "soon";
	return new Date(iso).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

function Badge() {
	const queryClient = useQueryClient();
	const { data } = useSuspenseQuery(trpc.subscription.getStatus.queryOptions());
	const status = data as SubscriptionStatus;
	const { usedToday, limit, plan, cancelAtPeriodEnd, currentPeriodEnd } =
		status;
	const isFull = usedToday >= limit;
	const [confirmOpen, setConfirmOpen] = useState(false);

	const cancel = useMutation(
		trpc.subscription.cancel.mutationOptions({
			onSuccess: (result) => {
				queryClient.invalidateQueries({
					queryKey: trpc.subscription.getStatus.queryKey(),
				});
				setConfirmOpen(false);
				const data = result as { alreadyCancelled?: boolean };
				if (data?.alreadyCancelled) {
					toast.info("Your plan is already scheduled to cancel.");
				} else {
					toast.success("Plan cancelled", {
						description: `You'll keep Premium access until ${formatEndDate(currentPeriodEnd)}.`,
					});
				}
			},
			onError: () => {
				toast.error("Could not cancel plan. Please try again.");
			},
		}),
	);

	const showCancelled = plan === "premium" && cancelAtPeriodEnd;
	const ariaUsage = `${usedToday} of ${limit} analyses used today`;

	if (plan === "free") {
		return (
			<Link
				href="/upgrade"
				aria-label={`${ariaUsage}. Upgrade to Premium`}
				className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-1 py-1 pr-3 text-xs transition-all hover:bg-card hover:shadow-sm"
			>
				<span
					aria-hidden
					className={`flex h-6 items-center justify-center rounded-full px-2 font-mono tabular-nums ${
						isFull
							? "bg-destructive/10 text-destructive"
							: "bg-foreground/[0.05] text-foreground/70"
					}`}
				>
					{usedToday}/{limit}
				</span>
				<span className="flex items-center gap-1 font-medium text-foreground/80 transition-colors group-hover:text-foreground">
					<SparklesIcon className="h-3 w-3" />
					Upgrade
				</span>
			</Link>
		);
	}

	return (
		<>
			<div
				aria-label={ariaUsage}
				role="status"
				className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-1 py-1 pr-2.5 text-xs"
			>
				<span
					aria-hidden
					className={`flex h-6 items-center justify-center rounded-full px-2 font-mono tabular-nums ${
						isFull
							? "bg-destructive/10 text-destructive"
							: "bg-foreground/[0.05] text-foreground/70"
					}`}
				>
					{usedToday}/{limit}
				</span>
				{showCancelled ? (
					<span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
						Ends {formatEndDate(currentPeriodEnd)}
					</span>
				) : (
					<button
						type="button"
						onClick={() => setConfirmOpen(true)}
						disabled={cancel.isPending}
						className="group/btn flex items-center gap-1 font-medium text-foreground/80 transition-colors hover:text-foreground disabled:opacity-60"
						aria-label="Cancel premium plan"
					>
						<SparklesIcon className="h-3 w-3" />
						<span className="group-hover/btn:hidden">Premium</span>
						<span className="hidden group-hover/btn:inline">Cancel</span>
					</button>
				)}
			</div>
			<CancelPlanDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				onConfirm={() => cancel.mutate()}
				isPending={cancel.isPending}
			/>
		</>
	);
}

function AuthenticatedBadge() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending || !session) return null;

	return (
		<Suspense
			fallback={
				<div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
			}
		>
			<Badge />
		</Suspense>
	);
}

export function UsageBadge() {
	return <AuthenticatedBadge />;
}
