"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Suspense } from "react";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

function Badge() {
	const { data } = useSuspenseQuery(trpc.subscription.getStatus.queryOptions());
	const { usedToday, limit, plan } = data;
	const isFull = usedToday >= limit;

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
			{plan === "premium" && (
				<span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-emerald-600 text-xs dark:text-emerald-400">
					Premium
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
