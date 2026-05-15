"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";

import { CancelPlanDialog } from "@/components/subscription/cancel-plan-dialog";
import { trpc } from "@/lib/trpc";
import { usePlanMutations } from "../hooks/use-plan-mutations";
import {
	formatEndDate,
	PLAN_FEATURES,
	PLAN_PRICE,
} from "../utils/plan-features";
import { CancelButton, SubscribeButton } from "./plan-actions";
import { ActivePlanBadge, CancellingPlanBadge } from "./plan-status-badge";

type SubscriptionStatus = {
	plan: "free" | "premium";
	cancelAtPeriodEnd: boolean;
	currentPeriodEnd: string | null;
};

const FeatureList = () => (
	<ul className="mt-7 space-y-2.5">
		{PLAN_FEATURES.map((feature) => (
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
);

const CancellingNotice = ({ endDate }: { endDate: string }) => (
	<div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/4 px-4 py-3">
		<p className="text-amber-700 text-xs leading-relaxed dark:text-amber-400">
			Your plan is scheduled to end on{" "}
			<span className="font-medium">{endDate}</span>. You'll keep Premium access
			until then.
		</p>
	</div>
);

export const PlanCard = () => {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const { data } = useSuspenseQuery(trpc.subscription.getStatus.queryOptions());

	const status = data as SubscriptionStatus;
	const isPremium = status.plan === "premium";
	const isCancelling = status.cancelAtPeriodEnd;
	const endDate = formatEndDate(status.currentPeriodEnd);

	const { checkout, cancel } = usePlanMutations({
		endDate,
		onCancelSuccess: () => setIsConfirmOpen(false),
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
			className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-7"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute top-0 left-1/2 h-32 w-96 -translate-x-1/2 rounded-full bg-foreground/5 blur-3xl"
			/>

			<div className="relative">
				<div className="flex items-center justify-between">
					<p className="text-foreground/55 text-xs">Premium</p>
					{isPremium && !isCancelling && <ActivePlanBadge />}
					{isPremium && isCancelling && (
						<CancellingPlanBadge endDate={endDate} />
					)}
				</div>
				<div className="mt-1 flex items-baseline gap-1.5">
					<span className="font-medium text-5xl text-foreground tabular-nums tracking-tight">
						{PLAN_PRICE}
					</span>
					<span className="text-foreground/45 text-sm">/month</span>
				</div>

				<FeatureList />

				{isPremium && isCancelling && <CancellingNotice endDate={endDate} />}

				{isPremium && !isCancelling && (
					<CancelButton
						onClick={() => setIsConfirmOpen(true)}
						isPending={cancel.isPending}
					/>
				)}

				{!isPremium && (
					<SubscribeButton
						onClick={() => checkout.mutate()}
						isPending={checkout.isPending}
					/>
				)}

				<p className="mt-3 text-center text-[11px] text-foreground/40">
					{isPremium
						? "Manage billing securely through Polar.sh"
						: "Payment handled securely by Polar.sh"}
				</p>
			</div>

			<CancelPlanDialog
				open={isConfirmOpen}
				onOpenChange={setIsConfirmOpen}
				onConfirm={() => cancel.mutate()}
				isPending={cancel.isPending}
			/>
		</motion.div>
	);
};

export const PlanCardSkeleton = () => (
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
