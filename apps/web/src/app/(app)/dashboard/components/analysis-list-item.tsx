"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";

import { RelativeDate } from "./relative-date";
import { ScoreBadge } from "./score-badge";
import { InProgressBadge } from "./status-badge";

const MAX_IDEA_PREVIEW = 120;
const MAX_VERDICT_PREVIEW = 110;

type Analysis = {
	id: string;
	rawIdea: string;
	synthesis: unknown;
	createdAt: string;
};

type Synthesis = {
	overallScore?: number;
	verdict?: string;
} | null;

const truncate = (text: string, max: number) =>
	text.length > max ? `${text.slice(0, max)}…` : text;

export const AnalysisListItem = ({
	analysis,
	index,
	withTopBorder,
}: {
	analysis: Analysis;
	index: number;
	withTopBorder: boolean;
}) => {
	const synthesis = analysis.synthesis as Synthesis;

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.4,
				delay: index * 0.03,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			<Link
				href={`/dashboard/${analysis.id}`}
				className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-foreground/[0.02] ${
					withTopBorder ? "border-border/60 border-t" : ""
				}`}
			>
				<div className="min-w-0 flex-1">
					<p className="truncate font-medium text-[15px] text-foreground leading-snug tracking-tight">
						{truncate(analysis.rawIdea, MAX_IDEA_PREVIEW)}
					</p>
					{synthesis?.verdict && (
						<p className="mt-1 truncate text-foreground/55 text-xs leading-relaxed">
							{truncate(synthesis.verdict, MAX_VERDICT_PREVIEW)}
						</p>
					)}
				</div>
				<div className="flex shrink-0 items-center gap-3">
					{synthesis?.overallScore !== undefined ? (
						<ScoreBadge score={synthesis.overallScore} />
					) : (
						<InProgressBadge />
					)}
					<RelativeDate date={new Date(analysis.createdAt)} />
					<ArrowRightIcon className="h-4 w-4 text-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-foreground/60" />
				</div>
			</Link>
		</motion.div>
	);
};
