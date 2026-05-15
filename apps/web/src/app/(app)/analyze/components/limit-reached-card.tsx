"use client";

import { motion } from "motion/react";
import Link from "next/link";

export const LimitReachedCard = () => (
	<motion.div
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
		className="rounded-2xl border border-amber-500/20 bg-amber-500/4 px-5 py-5"
	>
		<p className="font-medium text-foreground text-sm">Daily limit reached</p>
		<p className="mt-1 text-foreground/55 text-sm leading-relaxed">
			You&apos;ve used all your analyses for today. Resets at midnight UTC.
		</p>
		<Link
			href="/upgrade"
			className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 font-medium text-background text-xs transition-all hover:scale-[1.02] hover:bg-foreground/90"
		>
			Upgrade to Premium · 3/day
		</Link>
	</motion.div>
);
