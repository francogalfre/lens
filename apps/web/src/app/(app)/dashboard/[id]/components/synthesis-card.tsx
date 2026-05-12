"use client";

import { CheckIcon } from "@heroicons/react/24/outline";

interface SynthesisData {
	overallScore: number;
	verdict: string;
	topRecommendations: string[];
	summary: string;
}

const cap = (s?: string): string | undefined =>
	s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined;

export function SynthesisCard({ synthesis }: { synthesis: SynthesisData }) {
	const score = synthesis.overallScore;

	return (
		<div className="overflow-hidden rounded-3xl border border-border bg-card/50 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_80px_-32px_rgba(0,0,0,0.6)]">
			<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
				<div className="border-border/60 border-b p-7 lg:border-r lg:border-b-0">
					<span className="text-[11px] text-foreground/45">
						Overall viability
					</span>
					<div className="mt-2 flex items-baseline gap-2">
						<span className="font-medium text-6xl text-foreground tabular-nums leading-none tracking-tight">
							{score}
						</span>
						<span className="text-foreground/40 text-sm">/ 10</span>
					</div>

					<div className="mt-6">
						<span className="text-[11px] text-foreground/45">Verdict</span>
						<p className="mt-1.5 text-balance text-base text-foreground leading-relaxed">
							{synthesis.verdict}
						</p>
					</div>
				</div>

				<div className="space-y-5 p-7">
					<div>
						<span className="text-[11px] text-foreground/45">Summary</span>
						<p className="mt-1.5 text-foreground/85 text-sm leading-relaxed">
							{synthesis.summary}
						</p>
					</div>

					{synthesis.topRecommendations.length > 0 && (
						<div className="border-border/60 border-t pt-5">
							<span className="text-[11px] text-foreground/45">
								Top recommendations
							</span>
							<ul className="mt-2 space-y-2">
								{synthesis.topRecommendations.map((rec, i) => (
									<li
										key={i}
										className="flex gap-2.5 text-foreground/85 text-sm leading-relaxed"
									>
										<CheckIcon
											className="mt-1 h-3.5 w-3.5 shrink-0 text-foreground/55"
											strokeWidth={2.5}
										/>
										<span>{cap(rec)}</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
