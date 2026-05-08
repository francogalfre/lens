"use client";

import { Card, CardContent, CardHeader } from "@lens/ui/components/card";
import { NumberTicker } from "@lens/ui/components/number-ticker";
import { useEffect, useState } from "react";

interface SynthesisData {
	overallScore: number;
	verdict: string;
	topRecommendations: string[];
	summary: string;
}

const cap = (s?: string): string | undefined =>
	s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined;

function useTypewriter(text: string, speed = 30) {
	const [displayed, setDisplayed] = useState("");

	useEffect(() => {
		setDisplayed("");
		if (!text) return;
		let i = 0;
		const id = setInterval(() => {
			i++;
			setDisplayed(text.slice(0, i));
			if (i >= text.length) clearInterval(id);
		}, 1000 / speed);
		return () => clearInterval(id);
	}, [text, speed]);

	return displayed;
}

export function SynthesisCard({ synthesis }: { synthesis: SynthesisData }) {
	const score = synthesis.overallScore;
	const verdict = useTypewriter(synthesis.verdict);
	const summary = useTypewriter(synthesis.summary);

	const scoreColor =
		score >= 7
			? "text-green-600 dark:text-green-400"
			: score >= 4
				? "text-amber-600 dark:text-amber-400"
				: "text-red-600 dark:text-red-400";
	const scoreBg =
		score >= 7
			? "bg-green-50 dark:bg-green-950/30"
			: score >= 4
				? "bg-amber-50 dark:bg-amber-950/30"
				: "bg-red-50 dark:bg-red-950/30";

	return (
		<Card className="mt-4 w-full max-w-2xl">
			<CardHeader className="pb-3">
				<span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
					Analysis Result
				</span>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					className={`flex items-start gap-4 rounded-lg border p-4 ${scoreBg}`}
				>
					<div className="shrink-0 text-center">
						<NumberTicker
							value={score}
							className={`font-mono font-semibold text-4xl leading-none ${scoreColor}`}
						/>
						<span className="font-mono text-muted-foreground text-xs">
							/ 10
						</span>
					</div>
					<p className="min-h-[1.25rem] text-sm leading-relaxed">
						{verdict}
						{verdict.length < synthesis.verdict.length && (
							<span className="animate-pulse">▋</span>
						)}
					</p>
				</div>

				<div>
					<span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
						Summary
					</span>
					<p className="mt-1 min-h-[1.25rem] text-sm leading-relaxed">
						{summary}
						{summary.length < synthesis.summary.length && (
							<span className="animate-pulse">▋</span>
						)}
					</p>
				</div>

				{synthesis.topRecommendations.length > 0 && (
					<div>
						<span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
							Recommendations
						</span>
						<ol className="mt-2 space-y-2">
							{synthesis.topRecommendations.map((rec, i) => (
								<li key={i} className="flex gap-3 text-sm">
									<span className="mt-0.5 shrink-0 font-mono text-muted-foreground text-xs">
										{String(i + 1).padStart(2, "0")}
									</span>
									{cap(rec)}
								</li>
							))}
						</ol>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
