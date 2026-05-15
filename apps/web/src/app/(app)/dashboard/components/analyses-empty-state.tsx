"use client";

import { PlusIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";

export const AnalysesEmptyState = () => (
	<motion.div
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
		className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-card/40 px-6 py-20 text-center"
	>
		<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
			<SparklesIcon className="h-5 w-5 text-foreground/55" strokeWidth={1.75} />
		</div>
		<div className="space-y-1.5">
			<p className="font-medium text-foreground">No analyses yet</p>
			<p className="text-foreground/55 text-sm">
				Submit an idea to get started.
			</p>
		</div>
		<Link
			href="/"
			className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 font-medium text-background text-xs transition-all hover:scale-[1.02] hover:bg-foreground/90"
		>
			<PlusIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
			Start your first analysis
		</Link>
	</motion.div>
);
