"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import Loader from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { Confetti } from "./components/confetti";
import { ReceiptDetails } from "./components/receipt-details";
import { SuccessHeader } from "./components/success-header";

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

const formatNextBilling = () =>
	new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(Date.now() + ONE_MONTH_MS));

const SuspenseFallback = () => (
	<div className="flex min-h-[60vh] items-center justify-center">
		<Loader size={32} strokeWidth={2.5} className="text-foreground/60" />
	</div>
);

const SuccessContent = () => {
	const searchParams = useSearchParams();
	const checkoutId = searchParams.get("checkout_id") ?? "";
	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();
	const router = useRouter();
	const [showConfetti, setShowConfetti] = useState(false);

	useEffect(() => {
		const invalidateAndRefresh = async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: trpc.subscription.getStatus.queryKey(),
				}),
				queryClient.invalidateQueries({
					queryKey: trpc.dashboard.listAnalyses.queryKey(),
				}),
			]);
			router.refresh();
		};
		invalidateAndRefresh();
	}, [queryClient, router]);

	useEffect(() => {
		const showTimer = setTimeout(() => setShowConfetti(true), 120);
		const hideTimer = setTimeout(() => setShowConfetti(false), 6000);
		return () => {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
		};
	}, []);

	const displayId = checkoutId ? checkoutId.slice(0, 16).toUpperCase() : "—";
	const nextBilling = formatNextBilling();

	return (
		<div className="relative flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 pt-28 pb-12">
			{showConfetti && <Confetti />}
			<motion.div
				initial={{ opacity: 0, scale: 0.96, y: 16 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
				className="relative z-10 w-full max-w-sm rounded-3xl border border-border bg-card text-card-foreground shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]"
			>
				<span
					aria-hidden
					className="absolute top-1/2 left-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background"
				/>
				<span
					aria-hidden
					className="absolute top-1/2 right-0 h-7 w-7 translate-x-1/2 -translate-y-1/2 rounded-full bg-background"
				/>

				<SuccessHeader />
				<div
					aria-hidden
					className="mx-8 border-border/80 border-t-2 border-dashed"
				/>
				<ReceiptDetails
					displayId={displayId}
					nextBilling={nextBilling}
					user={session?.user ?? null}
				/>
				<div
					aria-hidden
					className="mx-8 border-border/80 border-t-2 border-dashed"
				/>

				<div className="px-8 pt-5 pb-8">
					<Link
						href="/dashboard"
						className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-foreground font-medium text-background text-sm transition-all hover:bg-foreground/90"
					>
						Go to dashboard
					</Link>
					<Link
						href="/"
						className="mt-3 block text-center text-foreground/55 text-xs transition-colors hover:text-foreground"
					>
						Analyze a new idea
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

const UpgradeSuccessPage = () => (
	<Suspense fallback={<SuspenseFallback />}>
		<SuccessContent />
	</Suspense>
);

export default UpgradeSuccessPage;
