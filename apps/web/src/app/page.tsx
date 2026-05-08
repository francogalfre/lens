"use client";

import { Button } from "@lens/ui/components/button";
import { Sparkles } from "lucide-react";
import { IdeaInput } from "@/components/analysis/idea-input";
import { useAnalysis } from "@/components/analysis/use-analysis";
import { AgentAccordion } from "@/components/landing/agent-accordion";
import { SynthesisCard } from "@/components/landing/synthesis-card";
import { authClient } from "@/lib/auth-client";

export default function Home() {
	const {
		agents,
		synthesis,
		errorMsg,
		isRunning,
		isComplete,
		submitIdea,
		reset,
	} = useAnalysis();
	const { isPending: isSessionPending } = authClient.useSession();

	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col">
			<div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-16">
				<div className="w-full max-w-2xl space-y-8">
					<header
						className={`text-center transition-all duration-500 ${isRunning ? "opacity-50" : "opacity-100"}`}
					>
						<div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5">
							<Sparkles className="mr-2 h-4 w-4 text-primary" />
							<span className="font-medium text-primary text-sm">
								AI-Powered Analysis
							</span>
						</div>
						<h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
							What&apos;s your idea?
						</h1>
						<p className="mt-4 text-lg text-muted-foreground">
							Describe it briefly — our AI agents will analyze the market,
							assess risks, and find opportunities.
						</p>
					</header>

					<IdeaInput
						onSubmit={submitIdea}
						isRunning={isRunning}
						isPendingAuth={isSessionPending}
					/>

					{errorMsg && (
						<div
							role="alert"
							className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive"
						>
							<span className="font-medium">Error:</span>
							<span className="text-sm">{errorMsg}</span>
							<Button
								variant="ghost"
								size="sm"
								className="ml-auto hover:bg-destructive/20"
								onClick={reset}
							>
								Try again
							</Button>
						</div>
					)}
				</div>
			</div>

			{(agents.length > 0 || synthesis) && (
				<div className="w-full border-t bg-muted/20">
					<div className="mx-auto max-w-4xl px-4 py-8">
						{agents.length > 0 && <AgentAccordion agents={agents} />}
						{synthesis && <SynthesisCard synthesis={synthesis} />}
						{isComplete && (
							<div className="mt-6 flex justify-center">
								<Button variant="outline" onClick={reset}>
									Start New Analysis
								</Button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
