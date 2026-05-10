"use client";

import { Button } from "@lens/ui/components/button";
import { ArrowLeft, LayoutDashboard, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAnalysis } from "@/components/analysis/use-analysis";
import { AgentAccordion } from "@/components/landing/agent-accordion";
import { authClient } from "@/lib/auth-client";

export default function AnalyzePage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const {
		agents,
		errorMsg,
		isRunning,
		isComplete,
		limitReached,
		submitIdea,
		reset,
	} = useAnalysis();
	const startedRef = useRef(false);
	const [currentIdea, setCurrentIdea] = useState<string>("");

	useEffect(() => {
		if (isPending || !session) return;
		if (startedRef.current) return;

		const idea = sessionStorage.getItem("analyzingIdea");
		if (!idea) {
			router.replace("/");
			return;
		}

		startedRef.current = true;
		setCurrentIdea(idea);
		sessionStorage.removeItem("analyzingIdea");
		submitIdea(idea);
	}, [isPending, session, router, submitIdea]);

	const handleReset = () => {
		reset();
		startedRef.current = false;
		router.push("/");
	};

	return (
		<div className="mx-auto max-w-2xl px-4 py-10">
			{/* Top bar */}
			<div className="mb-8 flex items-center justify-between">
				<Link
					href="/"
					className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					New idea
				</Link>

				{isRunning && (
					<div className="flex items-center gap-2">
						<span className="relative flex h-1.5 w-1.5">
							<span className="absolute inset-0 animate-ping rounded-full bg-foreground/50 opacity-75" />
							<span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
						</span>
						<span className="text-muted-foreground text-xs">Analyzing…</span>
					</div>
				)}
			</div>

			{/* Idea snippet */}
			{currentIdea && (
				<div className="mb-8">
					<p className="mb-2 font-mono text-muted-foreground/60 text-xs uppercase tracking-widest">
						Analyzing
					</p>
					<p className="line-clamp-2 text-foreground/70 text-sm leading-relaxed">
						&ldquo;{currentIdea}&rdquo;
					</p>
				</div>
			)}

			{/* Agents */}
			<AgentAccordion agents={agents} />

			{/* Limit reached */}
			{limitReached && (
				<div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-4 text-left">
					<p className="font-medium text-sm">Daily limit reached</p>
					<p className="mt-1 text-muted-foreground text-sm">
						You&apos;ve used all your analyses for today. Resets at midnight
						UTC.
					</p>
					<Link href="/upgrade" className="mt-3 inline-block">
						<Button size="sm">Upgrade to Premium — 3/day</Button>
					</Link>
				</div>
			)}

			{/* Error */}
			{errorMsg && !limitReached && (
				<div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
					<p className="text-destructive text-sm">{errorMsg}</p>
				</div>
			)}

			{/* Completion CTAs */}
			{isComplete && (
				<div className="mt-10 flex flex-col items-center gap-3">
					<p className="text-muted-foreground text-sm">Analysis complete</p>
					<div className="flex gap-3">
						<Button
							variant="outline"
							size="sm"
							onClick={handleReset}
							className="gap-2"
						>
							<RotateCcw className="h-3.5 w-3.5" />
							New analysis
						</Button>
						<Button
							size="sm"
							render={<Link href="/dashboard" />}
							className="gap-2"
						>
							<LayoutDashboard className="h-3.5 w-3.5" />
							View dashboard
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
