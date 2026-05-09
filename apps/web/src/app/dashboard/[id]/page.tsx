"use client";

import { Button } from "@lens/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SynthesisCard } from "@/components/landing/synthesis-card";
import { trpc } from "@/utils/trpc";

function Label({ children }: { children: React.ReactNode }) {
	return (
		<span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
			{children}
		</span>
	);
}

function Field({ label, value }: { label: string; value?: string }) {
	if (!value) return null;
	return (
		<div>
			<Label>{label}</Label>
			<p className="mt-0.5 text-sm leading-relaxed">
				{value.charAt(0).toUpperCase() + value.slice(1)}
			</p>
		</div>
	);
}

function AnalysisDetail({ id }: { id: string }) {
	const { data: analysis } = useSuspenseQuery(
		trpc.dashboard.getAnalysis.queryOptions({ id }),
	);
	const router = useRouter();

	const parsedIdea = analysis.parsedIdea as {
		problem?: string;
		solution?: string;
		targetAudience?: string;
		techDomain?: string;
		category?: string;
	} | null;

	const synthesis = analysis.synthesis as {
		overallScore: number;
		verdict: string;
		summary: string;
		topRecommendations: string[];
	} | null;

	const handleAnalyzeAgain = () => {
		sessionStorage.setItem("pendingIdea", analysis.rawIdea);
		router.push("/");
	};

	return (
		<div className="space-y-8">
			<div className="rounded-xl border bg-card p-5">
				<Label>Original Idea</Label>
				<p className="mt-1 text-sm leading-relaxed">{analysis.rawIdea}</p>
			</div>

			{parsedIdea && (
				<div className="rounded-xl border bg-card p-5">
					<h2 className="mb-4 font-semibold">Parsed Idea</h2>
					<div className="space-y-3">
						<Field label="Problem" value={parsedIdea.problem} />
						<Field label="Solution" value={parsedIdea.solution} />
						<Field label="Target Audience" value={parsedIdea.targetAudience} />
						<div className="flex gap-8">
							<Field label="Domain" value={parsedIdea.techDomain} />
							<Field label="Category" value={parsedIdea.category} />
						</div>
					</div>
				</div>
			)}

			{synthesis && <SynthesisCard synthesis={synthesis} />}

			<div className="flex justify-center pb-4">
				<Button onClick={handleAnalyzeAgain} variant="outline">
					Analyze this idea again
				</Button>
			</div>
		</div>
	);
}

export default function AnalysisDetailPage() {
	const params = useParams<{ id: string }>();

	return (
		<div className="mx-auto max-w-3xl px-4 py-10">
			<Link
				href="/dashboard"
				className="mb-8 inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to dashboard
			</Link>
			<AnalysisDetail id={params.id} />
		</div>
	);
}
