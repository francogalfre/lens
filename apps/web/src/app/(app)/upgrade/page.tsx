"use client";

import {
	ArrowLeftIcon,
	ArrowPathIcon,
	CheckIcon,
	ClockIcon,
	SparklesIcon,
} from "@heroicons/react/24/outline";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { toast } from "sonner";

import { Footer } from "@/components/layout/footer";
import { CancelPlanDialog } from "@/components/subscription/cancel-plan-dialog";
import { trpc } from "@/lib/trpc";

const FEATURES = [
	"3 analyses per day",
	"Full market research",
	"Detailed critique & opportunities",
	"Priority on new agents",
	"Cancel any time",
];

interface SubscriptionStatus {
	plan: "free" | "premium";
	cancelAtPeriodEnd: boolean;
	currentPeriodEnd: string | null;
}

function formatEndDate(iso: string | null): string {
	if (!iso) return "the end of your billing period";
	return new Date(iso).toLocaleDateString(undefined, {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

function PlanCard() {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const queryClient = useQueryClient();

	const { data } = useSuspenseQuery(trpc.subscription.getStatus.queryOptions());

	const status = data as SubscriptionStatus;
	const isPremium = status.plan === "premium";
	const isCancelling = status.cancelAtPeriodEnd;
	const endDate = formatEndDate(status.currentPeriodEnd);

	const checkout = useMutation(
		trpc.subscription.createCheckout.mutationOptions({
			onSuccess: ({ checkoutUrl }: { checkoutUrl: string }) => {
				window.location.href = checkoutUrl;
			},
		}),
	);

	const cancel = useMutation(
		trpc.subscription.cancel.mutationOptions({
			onSuccess: (result) => {
				queryClient.invalidateQueries({
					queryKey: trpc.subscription.getStatus.queryKey(),
				});
				setConfirmOpen(false);
				const r = result as { alreadyCancelled?: boolean };
				if (r?.alreadyCancelled) {
					toast.info("Your plan is already scheduled to cancel.");
				} else {
					toast.success("Plan cancelled", {
						description: `You'll keep Premium access until ${endDate}.`,
					});
				}
			},
			onError: () => {
				toast.error("Could not cancel plan. Please try again.");
			},
		}),
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
			className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-7"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute top-0 left-1/2 h-32 w-96 -translate-x-1/2 rounded-full bg-foreground/[0.05] blur-3xl"
			/>

			<div className="relative">
				<div className="flex items-center justify-between">
					<p className="text-foreground/55 text-xs">Premium</p>
					{isPremium && !isCancelling && (
						<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-medium text-[10px] text-emerald-600 uppercase tracking-wider dark:text-emerald-400">
							<SparklesIcon className="h-2.5 w-2.5" />
							Active
						</span>
					)}
					{isPremium && isCancelling && (
						<span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-medium text-[10px] text-amber-600 uppercase tracking-wider dark:text-amber-400">
							<ClockIcon className="h-2.5 w-2.5" />
							Cancels {endDate}
						</span>
					)}
				</div>
				<div className="mt-1 flex items-baseline gap-1.5">
					<span className="font-medium text-5xl text-foreground tabular-nums tracking-tight">
						$4.99
					</span>
					<span className="text-foreground/45 text-sm">/month</span>
				</div>

				<ul className="mt-7 space-y-2.5">
					{FEATURES.map((feature) => (
						<li
							key={feature}
							className="flex items-center gap-2.5 text-foreground/80 text-sm"
						>
							<CheckIcon
								className="h-3.5 w-3.5 shrink-0 text-foreground/55"
								strokeWidth={2.5}
							/>
							{feature}
						</li>
					))}
				</ul>

				{isPremium && isCancelling && (
					<div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] px-4 py-3">
						<p className="text-amber-700 text-xs leading-relaxed dark:text-amber-400">
							Your plan is scheduled to end on{" "}
							<span className="font-medium">{endDate}</span>. You'll keep
							Premium access until then.
						</p>
					</div>
				)}

				{isPremium && !isCancelling && (
					<button
						type="button"
						onClick={() => setConfirmOpen(true)}
						disabled={cancel.isPending}
						className="mt-7 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-border bg-card/60 font-medium text-foreground/80 text-sm transition-all hover:bg-destructive/5 hover:text-destructive disabled:opacity-60"
					>
						{cancel.isPending ? (
							<>
								<ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
								Cancelling…
							</>
						) : (
							"Cancel plan"
						)}
					</button>
				)}

				{!isPremium && (
					<button
						type="button"
						onClick={() => checkout.mutate()}
						disabled={checkout.isPending}
						className="mt-7 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-foreground font-medium text-background text-sm transition-all hover:bg-foreground/90 disabled:opacity-60"
					>
						{checkout.isPending ? (
							<>
								<ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
								Redirecting…
							</>
						) : (
							"Subscribe now"
						)}
					</button>
				)}

				<p className="mt-3 text-center text-[11px] text-foreground/40">
					{isPremium
						? "Manage billing securely through Polar.sh"
						: "Payment handled securely by Polar.sh"}
				</p>
			</div>

			<CancelPlanDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				onConfirm={() => cancel.mutate()}
				isPending={cancel.isPending}
			/>
		</motion.div>
	);
}

function PlanCardSkeleton() {
	return (
		<div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-7">
			<div className="h-3 w-16 animate-pulse rounded bg-muted" />
			<div className="mt-3 h-12 w-32 animate-pulse rounded bg-muted" />
			<div className="mt-7 space-y-3">
				<div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
				<div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
				<div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
			</div>
			<div className="mt-7 h-10 w-full animate-pulse rounded-full bg-muted" />
		</div>
	);
}

export default function UpgradePage() {
	return (
		<>
			<div className="mx-auto w-full max-w-md flex-1 px-6 py-16">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				>
					<Link
						href="/"
						className="mb-10 inline-flex items-center gap-1.5 text-foreground/55 text-xs transition-colors hover:text-foreground"
					>
						<ArrowLeftIcon className="h-3.5 w-3.5" />
						Back
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
					className="mb-10 text-center"
				>
					<h1 className="font-medium text-4xl text-foreground leading-tight tracking-tight">
						Go <span className="font-light italic">Premium.</span>
					</h1>
					<p className="mt-3 text-balance text-foreground/55 text-sm leading-relaxed">
						Three full analyses every day. Cancel any time.
					</p>
				</motion.div>

				<Suspense fallback={<PlanCardSkeleton />}>
					<PlanCard />
				</Suspense>
			</div>
			<Footer />
		</>
	);
}
