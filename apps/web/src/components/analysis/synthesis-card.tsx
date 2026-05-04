"use client";

interface SynthesisData {
	overallScore: number;
	verdict: string;
	topRecommendations: string[];
	summary: string;
}

function ScoreRing({ score }: { score: number }) {
	const color =
		score >= 7
			? "text-green-500"
			: score >= 4
				? "text-amber-500"
				: "text-red-500";
	const bgColor =
		score >= 7
			? "bg-green-500/10 border-green-500/30"
			: score >= 4
				? "bg-amber-500/10 border-amber-500/30"
				: "bg-red-500/10 border-red-500/30";

	return (
		<div
			className={`flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 ${bgColor}`}
		>
			<span className={`font-mono text-3xl font-bold leading-none ${color}`}>
				{score}
			</span>
			<span className="text-muted-foreground font-mono text-xs">/10</span>
		</div>
	);
}

export function SynthesisCard({ synthesis }: { synthesis: SynthesisData }) {
	return (
		<div className="mt-8 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="rounded-lg border p-6">
				<div className="mb-4 flex items-start gap-4">
					<ScoreRing score={synthesis.overallScore} />
					<div className="flex-1">
						<h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
							Verdict
						</h3>
						<p className="text-sm font-medium leading-relaxed">
							{synthesis.verdict}
						</p>
					</div>
				</div>

				<div className="border-t pt-4">
					<h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
						Summary
					</h3>
					<p className="text-sm leading-relaxed text-foreground/80">
						{synthesis.summary}
					</p>
				</div>

				{synthesis.topRecommendations.length > 0 && (
					<div className="border-t pt-4 mt-4">
						<h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
							Top Recommendations
						</h3>
						<ol className="space-y-2">
							{synthesis.topRecommendations.map((rec, i) => (
								<li key={i} className="flex gap-3 text-sm">
									<span className="font-mono text-muted-foreground shrink-0">
										{String(i + 1).padStart(2, "0")}.
									</span>
									<span className="leading-relaxed">{rec}</span>
								</li>
							))}
						</ol>
					</div>
				)}
			</div>
		</div>
	);
}
