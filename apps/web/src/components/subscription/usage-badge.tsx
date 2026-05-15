"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Suspense } from "react";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { UsageCounter } from "./usage-counter";

type SubscriptionStatus = {
	usedToday: number;
	limit: number;
	plan: "free" | "premium";
	cancelAtPeriodEnd: boolean;
	currentPeriodEnd: string | null;
};

const formatEndDate = (iso: string | null): string => {
	if (!iso) return "soon";
	return new Date(iso).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
};

const FreeBadge = ({
	usedToday,
	limit,
	ariaLabel,
}: {
	usedToday: number;
	limit: number;
	ariaLabel: string;
}) => (
	<Link
		href="/upgrade"
		aria-label={`${ariaLabel}. Upgrade to Premium`}
		className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-1 py-1 pr-3 text-xs transition-all hover:bg-card hover:shadow-sm"
	>
		<UsageCounter used={usedToday} limit={limit} />
		<span className="flex items-center gap-1 font-medium text-foreground/80 transition-colors group-hover:text-foreground">
			<SparklesIcon className="h-3 w-3" />
			Upgrade
		</span>
	</Link>
);

const PremiumBadge = ({
	usedToday,
	limit,
	cancelAtPeriodEnd,
	currentPeriodEnd,
	ariaLabel,
}: {
	usedToday: number;
	limit: number;
	cancelAtPeriodEnd: boolean;
	currentPeriodEnd: string | null;
	ariaLabel: string;
}) => (
	<div
		aria-label={ariaLabel}
		role="status"
		className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-1 py-1 pr-2.5 text-xs"
	>
		<UsageCounter used={usedToday} limit={limit} />
		{cancelAtPeriodEnd ? (
			<span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
				Ends {formatEndDate(currentPeriodEnd)}
			</span>
		) : (
			<Link
				href="/upgrade"
				className="flex items-center gap-1 font-medium text-foreground/80 transition-colors hover:text-foreground"
				aria-label="Manage premium plan"
			>
				<SparklesIcon className="h-3 w-3" />
				Premium
			</Link>
		)}
	</div>
);

const Badge = () => {
	const { data } = useSuspenseQuery(trpc.subscription.getStatus.queryOptions());
	const status = data as SubscriptionStatus;
	const ariaLabel = `${status.usedToday} of ${status.limit} analyses used today`;

	if (status.plan === "free") {
		return (
			<FreeBadge
				usedToday={status.usedToday}
				limit={status.limit}
				ariaLabel={ariaLabel}
			/>
		);
	}

	return (
		<PremiumBadge
			usedToday={status.usedToday}
			limit={status.limit}
			cancelAtPeriodEnd={status.cancelAtPeriodEnd}
			currentPeriodEnd={status.currentPeriodEnd}
			ariaLabel={ariaLabel}
		/>
	);
};

export const UsageBadge = () => {
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
};
