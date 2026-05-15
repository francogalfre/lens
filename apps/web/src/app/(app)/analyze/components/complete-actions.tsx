"use client";

import { ArrowPathIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";

export const CompleteActions = ({ onReset }: { onReset: () => void }) => (
	<motion.div
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
		className="mt-12 flex flex-col items-center gap-4"
	>
		<p className="text-foreground/55 text-xs">Analysis complete</p>
		<div className="flex gap-2">
			<button
				type="button"
				onClick={onReset}
				className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-2 font-medium text-foreground/80 text-xs transition-all hover:bg-card hover:text-foreground"
			>
				<ArrowPathIcon className="h-3.5 w-3.5" />
				New analysis
			</button>
			<Link
				href="/dashboard"
				className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 font-medium text-background text-xs transition-all hover:scale-[1.02] hover:bg-foreground/90"
			>
				<Squares2X2Icon className="h-3.5 w-3.5" />
				View dashboard
			</Link>
		</div>
	</motion.div>
);
