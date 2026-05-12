"use client";

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

	return (
		<div className="flex items-center gap-2">
			<span
				className={`font-mono text-xs tabular-nums ${isFull ? "text-destructive" : "text-muted-foreground"}`}
			>
				{usedToday}/{limit}
			</span>
			{plan === "free" && (
				<Link
					href="/upgrade"
					className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary text-xs transition-colors hover:bg-primary/20"
				>
					Upgrade
				</Link>
			)}
			{plan === "premium" && !showCancelled && (
				<>
					<button
						type="button"
						onClick={() => setConfirmOpen(true)}
						disabled={cancel.isPending}
						className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-emerald-600 text-xs transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-60 dark:text-emerald-400"
					>
						{cancel.isPending ? "Cancelling…" : "Premium"}
					</button>
					<CancelPlanDialog
						open={confirmOpen}
						onOpenChange={setConfirmOpen}
						onConfirm={() => cancel.mutate()}
						isPending={cancel.isPending}
					/>
				</>
			)}
			{showCancelled && (
				<span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-amber-600 text-xs dark:text-amber-400">
					Ends {formatEndDate(currentPeriodEnd)}
				</span>
			)}
		</div>
	);
}

function AuthenticatedBadge() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending || !session) return null;

	return (
		<Suspense
			fallback={<div className="h-5 w-16 animate-pulse rounded bg-muted" />}
		>
			<Badge />
		</Suspense>
	);
}

export function UsageBadge() {
	return <AuthenticatedBadge />;
}
