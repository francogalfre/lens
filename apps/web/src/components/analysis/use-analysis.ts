"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";
import {
	AGENT_ORDER,
	type AgentState,
	type Status,
	type StreamEvent,
	type SynthesisResult,
} from "./types";

interface UseAnalysisReturn {
	status: Status;
	agents: AgentState[];
	synthesis: SynthesisResult | null;
	errorMsg: string | null;
	isRunning: boolean;
	isComplete: boolean;
	submitIdea: (idea: string) => Promise<void>;
	reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
	const [status, setStatus] = useState<Status>("idle");
	const [agents, setAgents] = useState<AgentState[]>([]);
	const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const router = useRouter();
	const { data: session, isPending: isSessionPending } =
		authClient.useSession();

	const isRunning = status === "running";
	const isComplete = status === "complete";

	const initAgents = useCallback(() => {
		return AGENT_ORDER.map((name) => ({
			name,
			status: "pending" as const,
			data: null,
			messages: [] as AgentState["messages"],
		}));
	}, []);

	const handleEvent = useCallback(
		(event: StreamEvent) => {
			if (event.type === "start") {
				setAgents(initAgents());
				return;
			}

			if (event.type === "nodeStart" && event.agent) {
				const agentName = event.agent;
				setAgents((prev) =>
					prev.map((a) =>
						a.name === agentName
							? {
									...a,
									status: "running",
									messages: [
										...(a.messages || []),
										{ type: "status", text: `Running ${a.name}...` },
									],
								}
							: a,
					),
				);
				return;
			}

			if (event.type === "agent" && event.agent) {
				const agentName = event.agent;
				const data = event.data as Record<string, Record<string, unknown>>;

				if (
					agentName === "parser_agent" &&
					data?.parser_agent?.validationError
				) {
					setAgents((prev) =>
						prev
							.filter((a) => a.name === "parser")
							.map((a) => ({ ...a, status: "complete" as const, data })),
					);
					return;
				}

				setAgents((prev) =>
					prev.map((a) =>
						a.name === agentName
							? {
									...a,
									status: "complete",
									data,
									messages: [
										...(a.messages || []),
										{ type: "complete", text: `Completed ${agentName}` },
									],
								}
							: a,
					),
				);

				if (agentName === "synthesis_agent") {
					const synthPayload = (data as Record<string, unknown>)
						?.synthesis_agent as { synthesis?: SynthesisResult } | undefined;
					if (synthPayload?.synthesis) {
						setSynthesis(synthPayload.synthesis);
					}
				}
				return;
			}

			if (event.type === "error") {
				setErrorMsg(event.error ?? "Unknown error");
				setStatus("error");
			}
		},
		[initAgents],
	);

	const submitIdea = useCallback(
		async (rawIdea: string) => {
			if (!rawIdea.trim() || status === "running") return;

			if (!session && !isSessionPending) {
				sessionStorage.setItem("pendingIdea", rawIdea);
				router.push("/login?callbackUrl=/");
				return;
			}
			if (isSessionPending) return;

			setStatus("running");
			setAgents([]);
			setSynthesis(null);
			setErrorMsg(null);

			try {
				const response = await fetch("/api/analyze", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ rawIdea }),
				});

				if (response.status === 401) {
					sessionStorage.setItem("pendingIdea", rawIdea);
					router.push("/login?callbackUrl=/");
					return;
				}

				if (!response.ok || !response.body) {
					throw new Error("Failed to connect to analysis service");
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let buffer = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split("\n");
					buffer = lines.pop() ?? "";

					for (const line of lines) {
						if (!line.trim()) continue;
						try {
							const event = JSON.parse(line) as StreamEvent;
							handleEvent(event);
						} catch {
							// skip malformed lines
						}
					}
				}

				setStatus("complete");
			} catch (err) {
				setErrorMsg(
					err instanceof Error ? err.message : "Something went wrong",
				);
				setStatus("error");
			}
		},
		[status, session, isSessionPending, router, handleEvent],
	);

	const reset = useCallback(() => {
		setIdea("");
		setStatus("idle");
		setAgents([]);
		setSynthesis(null);
		setErrorMsg(null);
		textareaRef.current?.focus();
	}, []);

	return {
		status,
		agents,
		synthesis,
		errorMsg,
		isRunning,
		isComplete,
		submitIdea,
		reset,
	};
}
