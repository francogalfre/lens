"use client";

import { Button } from "@lens/ui/components/button";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

import { trpc } from "@/utils/trpc";

export default function UpgradePage() {
	const checkout = useMutation(
		trpc.subscription.createCheckout.mutationOptions({
			onSuccess: ({ checkoutUrl }) => {
				window.location.href = checkoutUrl;
			},
		}),
	);

	return (
		<div className="mx-auto max-w-md px-4 py-20 text-center">
			<Link
				href="/"
				className="mb-8 inline-block text-muted-foreground text-sm hover:text-foreground"
			>
				← Back
			</Link>

			<h1 className="font-bold text-3xl tracking-tight">Go Premium</h1>
			<p className="mt-3 text-muted-foreground">
				3 analyses per day. Cancel any time.
			</p>

			<div className="mt-10 rounded-2xl border bg-card p-6 text-left">
				<p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
					Premium
				</p>
				<div className="mt-2 flex items-baseline gap-1">
					<span className="font-bold text-4xl">$9.99</span>
					<span className="text-muted-foreground">/month</span>
				</div>
				<ul className="mt-4 space-y-2 text-sm">
					<li className="flex items-center gap-2">
						<span className="text-emerald-500">✓</span> 3 analyses per day
					</li>
					<li className="flex items-center gap-2">
						<span className="text-emerald-500">✓</span> Full market research
					</li>
					<li className="flex items-center gap-2">
						<span className="text-emerald-500">✓</span> Detailed critique &amp;
						opportunities
					</li>
					<li className="flex items-center gap-2">
						<span className="text-emerald-500">✓</span> Cancel any time
					</li>
				</ul>
			</div>

			<Button
				className="mt-6 w-full"
				size="lg"
				onClick={() => checkout.mutate()}
				disabled={checkout.isPending}
			>
				{checkout.isPending ? "Redirecting to Polar…" : "Subscribe now"}
			</Button>

			<p className="mt-4 text-muted-foreground text-xs">
				Payment handled securely by Polar.sh
			</p>
		</div>
	);
}
