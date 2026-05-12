"use client";

import {
	ArrowLeftIcon,
	ArrowPathIcon,
	Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { LoadingBreadcrumb } from "@lens/ui/components/loading-breadcrumb";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAnalysis } from "@/hooks/use-analysis";
import { authClient } from "@/lib/auth-client";
import { AgentAccordion } from "./components/agent-accordion";
import { AgentStepList } from "./components/agent-step-list";

const RUNNING_LABEL: Record<string, string> = {
	parser_agent: "Reading",
	researcher_agent: "Researching",
	critic_agent: "Critiquing",
	opportunity_agent: "Mapping",
	feasibility_agent: "Sizing",
	synthesis_agent: "Synthesizing",
};

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
		submitIdea(idea);
	}, [isPending, session, router, submitIdea]);

	useEffect(() => {
		if (isComplete) sessionStorage.removeItem("analyzingIdea");
	}, [isComplete]);

	useEffect(() => {
		if (!isRunning) return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [isRunning]);

	const handleReset = () => {
		reset();
		startedRef.current = false;
		router.push("/");
	};

	const runningAgent = agents.find((a) => a.status === "running");
	const breadcrumbText = runningAgent
		? (RUNNING_LABEL[runningAgent.name] ?? "Working")
		: "Working";

	return (
		<div className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				className="mb-8 flex items-center justify-between"
			>
				<Link
					href="/"
					className="inline-flex items-center gap-1.5 text-foreground/55 text-xs transition-colors hover:text-foreground"
				>
					<ArrowLeftIcon className="h-3.5 w-3.5" />
					New idea
				</Link>

				{isRunning && <LoadingBreadcrumb text={breadcrumbText} />}
			</motion.div>

			{currentIdea && (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
					className="mb-6 rounded-2xl border border-border bg-card/40 px-5 py-4"
				>
					<p className="mb-1.5 text-[11px] text-foreground/45">Analyzing</p>
					<p className="line-clamp-2 text-[14px] text-foreground/85 leading-relaxed">
						&ldquo;{currentIdea}&rdquo;
					</p>
				</motion.div>
			)}

			{(isRunning || isComplete) && (
				<motion.section
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
					aria-label="Plan"
					className="mb-6 rounded-2xl border border-border bg-card/40 px-5 py-4"
				>
					<p className="mb-3 text-[11px] text-foreground/45 uppercase tracking-wider">
						Plan
					</p>
					<AgentStepList agents={agents} />
				</motion.section>
			)}

			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
				className="rounded-2xl border border-border bg-card/40 p-3 sm:p-4"
			>
				<AgentAccordion agents={agents} />
			</motion.div>

			{limitReached && (
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] px-5 py-4"
				>
					<p className="font-medium text-foreground text-sm">
						Daily limit reached
					</p>
					<p className="mt-1 text-foreground/55 text-sm leading-relaxed">
						You&apos;ve used all your analyses for today. Resets at midnight
						UTC.
					</p>
					<Link
						href="/upgrade"
						className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 font-medium text-background text-xs transition-all hover:scale-[1.02] hover:bg-foreground/90"
					>
						Upgrade to Premium · 3/day
					</Link>
				</motion.div>
			)}

			{errorMsg && !limitReached && (
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/[0.04] px-5 py-4"
				>
					<p className="text-destructive text-sm">{errorMsg}</p>
				</motion.div>
			)}

			{isComplete && (
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="mt-12 flex flex-col items-center gap-4"
				>
					<p className="text-foreground/55 text-xs">Analysis complete</p>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={handleReset}
							className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-2 font-medium text-foreground/80 text-xs transition-all hover:bg-card hover:text-foreground"
						>
							<ArrowPathIcon className="h-3.5 w-3.5" />
							New analysis
						</button>
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 font-medium text-background text-xs transition-all hover:scale-[1.02] hover:bg-foreground/90"
						>
							<Squares2X2Icon className="h-3.5 w-3.5" />
							View dashboard
						</Link>
					</div>
				</motion.div>
			)}
		</div>
	);
}
