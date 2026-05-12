"use client";

import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { trpc } from "@/lib/trpc";
import { Field } from "./components/field";
import { SynthesisCard } from "./components/synthesis-card";

function AnalysisDetail({ id }: { id: string }) {
	const { data: analysis } = useSuspenseQuery(
		trpc.dashboard.getAnalysis.queryOptions({ id }),
	);
	const router = useRouter();

	const analysisData = analysis as {
		rawIdea: string;
		parsedIdea: unknown;
		synthesis: unknown;
	};

	const parsedIdea = analysisData.parsedIdea as {
		problem?: string;
		solution?: string;
		targetAudience?: string;
		techDomain?: string;
		category?: string;
	} | null;

	const synthesis = analysisData.synthesis as {
		overallScore: number;
		verdict: string;
		summary: string;
		topRecommendations: string[];
	} | null;

	const handleAnalyzeAgain = () => {
		sessionStorage.setItem("pendingIdea", analysisData.rawIdea);
		router.push("/");
	};

	return (
		<div className="space-y-6">
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				className="rounded-2xl border border-border bg-card/40 p-6"
			>
				<span className="text-[11px] text-foreground/45">Original idea</span>
				<p className="mt-1.5 text-balance text-[15px] text-foreground leading-relaxed">
					{analysisData.rawIdea}
				</p>
			</motion.div>

			{parsedIdea && (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.5,
						delay: 0.05,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="rounded-2xl border border-border bg-card/40 p-6"
				>
					<h2 className="mb-5 font-medium text-foreground text-lg tracking-tight">
						Parsed idea
					</h2>
					<div className="space-y-4">
						<Field label="Problem" value={parsedIdea.problem} />
						<Field label="Solution" value={parsedIdea.solution} />
						<Field label="Target audience" value={parsedIdea.targetAudience} />
						<div className="flex gap-10">
							<Field label="Domain" value={parsedIdea.techDomain} />
							<Field label="Category" value={parsedIdea.category} />
						</div>
					</div>
				</motion.div>
			)}

			{synthesis && (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.6,
						delay: 0.1,
						ease: [0.22, 1, 0.36, 1],
					}}
				>
					<SynthesisCard synthesis={synthesis} />
				</motion.div>
			)}

			<div className="flex justify-center pt-2">
				<button
					type="button"
					onClick={handleAnalyzeAgain}
					className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-4 py-2 font-medium text-foreground/80 text-xs transition-all hover:bg-card hover:text-foreground"
				>
					<ArrowPathIcon className="h-3.5 w-3.5" />
					Analyze this idea again
				</button>
			</div>
		</div>
	);
}

export default function AnalysisDetailPage() {
	const params = useParams<{ id: string }>();

	return (
		<>
			<div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				>
					<Link
						href="/dashboard"
						className="mb-10 inline-flex items-center gap-1.5 text-foreground/55 text-xs transition-colors hover:text-foreground"
					>
						<ArrowLeftIcon className="h-3.5 w-3.5" />
						Back to dashboard
					</Link>
				</motion.div>
				<AnalysisDetail id={params.id} />
			</div>
			<Footer />
		</>
	);
}
