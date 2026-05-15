"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAnalysis } from "@/hooks/use-analysis";
import { authClient } from "@/lib/auth-client";
import { AgentAccordion } from "./components/agent-accordion";
import { CompleteActions } from "./components/complete-actions";
import { IdeaPreviewCard } from "./components/idea-preview-card";
import { LimitReachedCard } from "./components/limit-reached-card";

const BackLink = () => (
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
	</motion.div>
);

const ErrorMessage = ({ message }: { message: string }) => (
	<motion.div
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/4 px-5 py-4"
	>
		<p className="text-destructive text-sm">{message}</p>
	</motion.div>
);

const AgentsCard = ({
	agents,
}: {
	agents: Parameters<typeof AgentAccordion>[0]["agents"];
}) => (
	<motion.div
		initial={{ opacity: 0, y: 8 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
		className="rounded-2xl border border-border bg-card/40 p-5 sm:p-6"
	>
		<AgentAccordion agents={agents} />
	</motion.div>
);

const AnalyzePage = () => {
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
		const handler = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [isRunning]);

	const handleReset = () => {
		reset();
		startedRef.current = false;
		router.push("/");
	};

	return (
		<div className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
			<BackLink />

			{currentIdea && !limitReached && <IdeaPreviewCard idea={currentIdea} />}

			{limitReached ? <LimitReachedCard /> : <AgentsCard agents={agents} />}

			{errorMsg && !limitReached && <ErrorMessage message={errorMsg} />}

			{isComplete && !limitReached && <CompleteActions onReset={handleReset} />}
		</div>
	);
};

export default AnalyzePage;
