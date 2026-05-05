"use client";

import { useEffect, useState } from "react";
import { NumberTicker } from "@lens/ui/components/number-ticker";

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
	const scoreBorder =
		score >= 7
			? "border-green-200 dark:border-green-800"
			: score >= 4
				? "border-amber-200 dark:border-amber-800"
				: "border-red-200 dark:border-red-800";
	const scoreBg =
		score >= 7
			? "bg-green-50 dark:bg-green-950/30"
			: score >= 4
				? "bg-amber-50 dark:bg-amber-950/30"
				: "bg-red-50 dark:bg-red-950/30";

	return (
		<div className="animate-in fade-in slide-in-from-bottom-4 mt-4 w-full max-w-2xl rounded-lg border duration-500">
			<div className="border-b px-4 py-3">
				<span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
					Analysis result
				</span>
			</div>

			<div className="p-4">
				<div
					className={`mb-4 flex items-start gap-4 rounded-md border p-3 ${scoreBg} ${scoreBorder}`}
				>
					<div className="shrink-0 text-center">
						<NumberTicker
							value={score}
							className={`font-mono text-4xl font-semibold leading-none ${scoreColor}`}
						/>
						<span className="block font-mono text-muted-foreground text-xs">
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

				<div className="space-y-4">
					<div>
						<span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
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
						<div className="animate-in fade-in duration-700">
							<span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
								Recommendations
							</span>
							<ol className="mt-2 space-y-2">
								{synthesis.topRecommendations.map((rec, i) => (
									<li key={i} className="flex gap-3 text-sm leading-relaxed">
										<span className="mt-0.5 shrink-0 font-mono text-muted-foreground text-xs">
											{String(i + 1).padStart(2, "0")}
										</span>
										{cap(rec)}
									</li>
								))}
							</ol>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
