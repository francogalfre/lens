"use client";

import { Button } from "@lens/ui/components/button";
import { Textarea } from "@lens/ui/components/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  type AgentState,
  AgentTimeline,
} from "@/components/analysis/agent-timeline";
import { SynthesisCard } from "@/components/analysis/synthesis-card";
import { authClient } from "@/lib/auth-client";

type Status = "idle" | "running" | "complete" | "error";

interface StreamEvent {
  type: "start" | "nodeStart" | "agent" | "complete" | "error";
  sessionId?: string;
  agent?: string;
  data?: unknown;
  error?: string;
}

interface SynthesisResult {
  overallScore: number;
  verdict: string;
  topRecommendations: string[];
  summary: string;
}

const AGENT_ORDER = [
  "parser",
  "researcher",
  "critic",
  "opportunity",
  "feasibility_agent",
  "synthesis_agent",
];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  useEffect(() => {
    const saved = sessionStorage.getItem("pendingIdea");
    if (saved) {
      setIdea(saved);
      sessionStorage.removeItem("pendingIdea");
    }
  }, []); // only on mount

  async function handleSubmit() {
    if (!idea.trim() || status === "running") return;

    if (!session && !isSessionPending) {
      sessionStorage.setItem("pendingIdea", idea);
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
        body: JSON.stringify({ rawIdea: idea }),
      });

      if (response.status === 401) {
        sessionStorage.setItem("pendingIdea", idea);
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
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  function handleEvent(event: StreamEvent) {
    if (event.type === "start") {
      setAgents(
        AGENT_ORDER.map((name) => ({
          name,
          status: "pending" as const,
          data: null,
        })),
      );
    }

    if (event.type === "nodeStart" && event.agent) {
      const agentName = event.agent;
      setAgents((prev) =>
        prev.map((a) =>
          a.name === agentName ? { ...a, status: "running" } : a,
        ),
      );
    }

    if (event.type === "agent" && event.agent) {
      const agentName = event.agent;
      const data = event.data as Record<string, Record<string, unknown>>;

      if (agentName === "parser" && data?.parser?.validationError) {
        setAgents((prev) =>
          prev
            .filter((a) => a.name === "parser")
            .map((a) => ({ ...a, status: "complete" as const, data })),
        );
        return;
      }

      setAgents((prev) =>
        prev.map((a) =>
          a.name === agentName ? { ...a, status: "complete", data } : a,
        ),
      );

      if (agentName === "synthesis_agent") {
        const synthPayload = data?.synthesis_agent as
          | { synthesis?: SynthesisResult }
          | undefined;
        if (synthPayload?.synthesis) {
          setSynthesis(synthPayload.synthesis);
        }
      }
    }

    if (event.type === "error") {
      setErrorMsg(event.error ?? "Unknown error");
      setStatus("error");
    }
  }

  const isRunning = status === "running";

  return (
    <main className="flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-semibold text-3xl tracking-tight">
            What&apos;s your idea?
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Describe it briefly — our agents will analyze the market, risks, and
            opportunities.
          </p>
        </div>

        <div className="space-y-3">
          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g. An app that uses AI to summarize Zoom meetings automatically..."
            rows={4}
            disabled={isRunning || isSessionPending}
            className="resize-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                void handleSubmit();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <span className="font-mono text-muted-foreground text-xs">
              {isRunning ? "Analysis in progress..." : "⌘ + Enter to submit"}
            </span>
            <Button
              onClick={() => void handleSubmit()}
              disabled={isRunning || !idea.trim()}
              size="sm"
            >
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Analyzing
                </span>
              ) : (
                "Analyze →"
              )}
            </Button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-500 text-sm">
            {errorMsg}
          </div>
        )}

        <AgentTimeline agents={agents} />

        {synthesis && <SynthesisCard synthesis={synthesis} />}
      </div>
    </main>
  );
}
