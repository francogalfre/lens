"use client";

import { motion } from "motion/react";

export const IdeaPreviewCard = ({ idea }: { idea: string }) => (
	<motion.div
		initial={{ opacity: 0, y: 8 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
		className="mb-6 rounded-2xl border border-border bg-card/40 px-5 py-4"
	>
		<p className="mb-1.5 text-[11px] text-foreground/45">Analyzing</p>
		<p className="line-clamp-2 text-[14px] text-foreground/85 leading-relaxed">
			&ldquo;{idea}&rdquo;
		</p>
	</motion.div>
);
