import { useCallback } from "react";

import {
	AGENT_ORDER,
	type AgentState,
	type StreamEvent,
	type SynthesisResult,
} from "@/types/analysis";

export const createInitialAgents = (): AgentState[] =>
	AGENT_ORDER.map((agentName) => ({
		name: agentName,
		status: "pending" as const,
		data: null,
		messages: [] as AgentState["messages"],
	}));

type EventHandlerOptions = {
	setAgents: React.Dispatch<React.SetStateAction<AgentState[]>>;
	setSynthesis: React.Dispatch<React.SetStateAction<SynthesisResult | null>>;
	setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
	setStatus: React.Dispatch<
		React.SetStateAction<"idle" | "running" | "complete" | "error">
	>;
};

export const useStreamEventHandler = ({
	setAgents,
	setSynthesis,
	setErrorMsg,
	setStatus,
}: EventHandlerOptions) =>
	useCallback(
		(event: StreamEvent) => {
			if (event.type === "start") {
				setAgents(createInitialAgents());
				return;
			}

			if (event.type === "nodeStart" && event.agent) {
				const agentName = event.agent;
				setAgents((previous) =>
					previous.map((agent) =>
						agent.name === agentName ? { ...agent, status: "running" } : agent,
					),
				);
				return;
			}

			if (event.type === "agent" && event.agent && event.data) {
				const agentName = event.agent;
				const data = event.data as Record<string, Record<string, unknown>>;

				if (
					agentName === "parser_agent" &&
					data?.parser_agent?.validationError
				) {
					setAgents((previous) =>
						previous
							.filter((agent) => agent.name === "parser_agent")
							.map((agent) => ({
								...agent,
								status: "complete" as const,
								data,
							})),
					);
					return;
				}

				setAgents((previous) =>
					previous.map((agent) =>
						agent.name === agentName
							? { ...agent, status: "complete", data }
							: agent,
					),
				);

				if (agentName === "synthesis_agent") {
					const synthesisPayload = data?.synthesis_agent as
						| { synthesis?: SynthesisResult }
						| undefined;
					if (synthesisPayload?.synthesis) {
						setSynthesis(synthesisPayload.synthesis);
					}
				}
				return;
			}

			if (event.type === "error") {
				setErrorMsg(event.error ?? "Unknown error");
				setStatus("error");
			}
		},
		[setAgents, setSynthesis, setErrorMsg, setStatus],
	);
