"use client";

import { CheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function UpgradeSuccessPage() {
	const searchParams = useSearchParams();
	const checkoutId = searchParams.get("checkout_id") ?? "";
	const { data: session } = authClient.useSession();
	const [showConfetti, setShowConfetti] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setShowConfetti(true), 120);
		const u = setTimeout(() => setShowConfetti(false), 6000);
		return () => {
			clearTimeout(t);
			clearTimeout(u);
		};
	}, []);

	const displayId = checkoutId ? checkoutId.slice(0, 16).toUpperCase() : "—";

	const nextBilling = new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

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

				<div className="flex flex-col items-center px-8 pt-10 pb-6 text-center">
					<motion.div
						initial={{ scale: 0.4, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.25, type: "spring", stiffness: 220 }}
						className="rounded-full bg-foreground/[0.05] p-3 ring-1 ring-foreground/10"
					>
						<motion.span
							initial={{ scale: 0.4 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.4, type: "spring", stiffness: 260 }}
							className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background"
						>
							<CheckIcon className="h-5 w-5" strokeWidth={3} />
						</motion.span>
					</motion.div>
					<h1 className="mt-5 font-medium text-2xl text-foreground leading-tight tracking-tight">
						Welcome to Premium
					</h1>
					<p className="mt-1.5 text-foreground/55 text-sm">
						Your subscription is active. Time to put more ideas under the lens.
					</p>
				</div>

				<div
					aria-hidden
					className="mx-8 border-border/80 border-t-2 border-dashed"
				/>

				<div className="space-y-5 px-8 py-6">
					<div className="grid grid-cols-2 gap-4 text-left">
						<div>
							<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
								Plan
							</p>
							<div className="mt-0.5 flex items-center gap-1.5 font-medium text-foreground text-sm">
								<SparklesIcon className="h-3.5 w-3.5" />
								Premium
							</div>
						</div>
						<div className="text-right">
							<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
								Billed
							</p>
							<p className="mt-0.5 font-semibold text-base text-foreground">
								$4.99
								<span className="ml-0.5 font-normal text-foreground/45 text-xs">
									/mo
								</span>
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 text-left">
						<div>
							<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
								Checkout ID
							</p>
							<p className="mt-0.5 font-mono text-foreground/80 text-xs">
								{displayId}
							</p>
						</div>
						<div className="text-right">
							<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
								Renews
							</p>
							<p className="mt-0.5 text-foreground/80 text-xs">{nextBilling}</p>
						</div>
					</div>

					{session?.user?.email ? (
						<div className="rounded-xl bg-muted/50 px-3.5 py-3">
							<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
								Account
							</p>
							<p className="mt-0.5 font-medium text-foreground text-sm">
								{session.user.name}
							</p>
							<p className="text-foreground/55 text-xs">{session.user.email}</p>
						</div>
					) : null}
				</div>

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
}

const COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#3b82f6",
	"#8b5cf6",
];

function Confetti() {
	const pieces = Array.from({ length: 80 }, (_, i) => i);
	return (
		<>
			<style>{`
				@keyframes lensConfettiFall {
					0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
					100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
				}
			`}</style>
			<div
				aria-hidden
				className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
			>
				{pieces.map((i) => (
					<span
						key={i}
						className="absolute h-3 w-1.5 rounded-sm"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${-20 + Math.random() * 10}%`,
							backgroundColor: COLORS[i % COLORS.length],
							transform: `rotate(${Math.random() * 360}deg)`,
							animation: `lensConfettiFall ${2.4 + Math.random() * 2.4}s ${Math.random() * 1.8}s linear forwards`,
						}}
					/>
				))}
			</div>
		</>
	);
}
