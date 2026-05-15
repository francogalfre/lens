"use client";

import { env } from "@lens/env/web";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import type {
	AgentState,
	Status,
	SynthesisResult,
	UseAnalysisReturn,
} from "@/hooks/analysis.types";
import {
	createInitialAgents,
	useStreamEventHandler,
} from "@/hooks/use-analysis-event-handler";
import { consumeAnalysisStream } from "@/hooks/use-analysis-stream";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

export const useAnalysis = (): UseAnalysisReturn => {
	const [status, setStatus] = useState<Status>("idle");
	const [agents, setAgents] = useState<AgentState[]>([]);
	const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [limitReached, setLimitReached] = useState(false);

	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: session, isPending: isSessionPending } =
		authClient.useSession();

	const handleEvent = useStreamEventHandler({
		setAgents,
		setSynthesis,
		setErrorMsg,
		setStatus,
	});

	const submitIdea = useCallback(
		async (rawIdea: string) => {
			if (!rawIdea.trim() || status === "running") return;

			if (!session && !isSessionPending) {
				sessionStorage.setItem("analyzingIdea", rawIdea);
				router.push("/login?callbackUrl=/analyze");
				return;
			}
			if (isSessionPending) return;

			setStatus("running");
			setAgents(createInitialAgents());
			setSynthesis(null);
			setErrorMsg(null);

			try {
				const response = await fetch(
					`${env.NEXT_PUBLIC_SERVER_URL}/api/analysis/stream`,
					{
						method: "POST",
						credentials: "include",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ rawIdea }),
					},
				);

				if (response.status === 401) {
					sessionStorage.setItem("analyzingIdea", rawIdea);
					router.push("/login?callbackUrl=/analyze");
					return;
				}
				if (response.status === 429) {
					setLimitReached(true);
					setStatus("error");
					return;
				}
				if (!response.ok || !response.body) {
					throw new Error("Failed to connect to analysis service");
				}

				queryClient.invalidateQueries({
					queryKey: trpc.subscription.getStatus.queryKey(),
				});

				await consumeAnalysisStream(response.body, handleEvent);

				setStatus("complete");
				queryClient.invalidateQueries({
					queryKey: trpc.dashboard.listAnalyses.queryKey(),
				});
				queryClient.invalidateQueries({
					queryKey: trpc.subscription.getStatus.queryKey(),
				});
			} catch (error) {
				setErrorMsg(
					error instanceof Error ? error.message : "Something went wrong",
				);
				setStatus("error");
			}
		},
		[status, session, isSessionPending, router, handleEvent, queryClient],
	);

	const reset = useCallback(() => {
		setStatus("idle");
		setAgents([]);
		setSynthesis(null);
		setErrorMsg(null);
		setLimitReached(false);
	}, []);

	return {
		status,
		agents,
		synthesis,
		errorMsg,
		isRunning: status === "running",
		isComplete: status === "complete",
		limitReached,
		submitIdea,
		reset,
	};
};
