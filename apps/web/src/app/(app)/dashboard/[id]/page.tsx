"use client";

import {
	ArrowDownTrayIcon,
	ArrowLeftIcon,
	ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Field } from "@/app/(app)/dashboard/[id]/components/field";
import { SynthesisCard } from "@/app/(app)/dashboard/[id]/components/synthesis-card";
import { InProgressBadge } from "@/app/(app)/dashboard/components/status-badge";
import { Footer } from "@/components/layout/footer";
import { useExportPdf } from "@/hooks/use-export-pdf";
import { trpc } from "@/lib/trpc";
import type {
	CritiqueData,
	FeasibilityData,
	OpportunityData,
	ParsedIdea,
	ResearchData,
	SynthesisData,
} from "@/types/analysis";

function AnalysisDetail({ id }: { id: string }) {
	const { data: analysis } = useSuspenseQuery(
		trpc.dashboard.getAnalysis.queryOptions({ id }),
	);
	const router = useRouter();

	const analysisData = analysis as {
		rawIdea: string;
		parsedIdea: ParsedIdea | null;
		synthesis: SynthesisData | null;
	};

	const parsedIdea = analysisData.parsedIdea;
	const synthesis = analysisData.synthesis;

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
				<div className="flex items-center justify-between gap-3">
					<span className="text-[11px] text-foreground/45">Original idea</span>
					{!synthesis && <InProgressBadge />}
				</div>
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

	const { data: analysis } = useSuspenseQuery(
		trpc.dashboard.getAnalysis.queryOptions({ id: params.id }),
	);

	const fullAnalysis = analysis as {
		rawIdea: string;
		parsedIdea: ParsedIdea | null;
		agentData?: unknown;
		synthesis: SynthesisData | null;
	};

	const isComplete = fullAnalysis.synthesis !== null;

	const { exportToPdf, isExporting } = useExportPdf();

	const handleExport = () => {
		const agentData =
			(fullAnalysis.agentData as {
				researcher_agent?: { research: unknown; completedAgents?: string[] };
				critic_agent?: { critique: unknown; completedAgents?: string[] };
				opportunity_agent?: {
					opportunities: unknown;
					completedAgents?: string[];
				};
				feasibility_agent?: {
					feasibility: unknown;
					completedAgents?: string[];
				};
			}) || {};

		const parsedIdea = fullAnalysis.parsedIdea;
		const research =
			(agentData.researcher_agent?.research as ResearchData | undefined) ||
			null;
		const critique =
			(agentData.critic_agent?.critique as CritiqueData | undefined) || null;
		const opportunities =
			(agentData.opportunity_agent?.opportunities as
				| OpportunityData
				| undefined) || null;
		const feasibility =
			(agentData.feasibility_agent?.feasibility as
				| FeasibilityData
				| undefined) || null;
		const synthesis = fullAnalysis.synthesis;

		exportToPdf({
			rawIdea: fullAnalysis.rawIdea,
			parsedIdea,
			research,
			critique,
			opportunities,
			feasibility,
			synthesis,
		});
	};

	return (
		<>
			<div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="mb-10 flex items-center justify-between"
				>
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-1.5 text-foreground/55 text-xs transition-colors hover:text-foreground"
					>
						<ArrowLeftIcon className="h-3.5 w-3.5" />
						Back to dashboard
					</Link>

					{isComplete && (
						<button
							type="button"
							onClick={handleExport}
							disabled={isExporting}
							className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 font-medium text-foreground/80 text-xs transition-all hover:bg-card hover:text-foreground disabled:opacity-50"
						>
							<ArrowDownTrayIcon className="h-3.5 w-3.5" />
							{isExporting ? "Exporting..." : "Export PDF"}
						</button>
					)}
				</motion.div>
				<AnalysisDetail id={params.id} />
			</div>
			<Footer />
		</>
	);
}
