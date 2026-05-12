"use client";

import {
	ClockIcon,
	LockClosedIcon,
	MapIcon,
	Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import { motion } from "motion/react";

import { Container } from "@/components/layout/container";

const REASONS = [
	{
		Icon: ClockIcon,
		title: "Minutes, not weeks",
		body: "Skip the spreadsheet phase. Get a defensible read in under a minute.",
	},
	{
		Icon: MapIcon,
		title: "Six perspectives",
		body: "Each agent stress-tests a different axis — no single-angle blind spots.",
	},
	{
		Icon: Square3Stack3DIcon,
		title: "Built on real data",
		body: "Live web search, competitor signal, and market context — not hallucinations.",
	},
	{
		Icon: LockClosedIcon,
		title: "Yours to keep",
		body: "Your ideas are encrypted at rest. We never train on your inputs.",
	},
];

export function WhyLens() {
	return (
		<section className="relative w-full py-24">
			<Container>
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-15% 0px" }}
					transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					className="mb-14 flex flex-col items-start gap-4 sm:items-center sm:text-center"
				>
					<h2 className="font-medium text-4xl text-foreground leading-[1.1] tracking-tight sm:text-5xl">
						Built for the moment
						<br />
						<span className="text-foreground/45">before the build.</span>
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
					{REASONS.map((reason, i) => (
						<motion.div
							key={reason.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-10% 0px" }}
							transition={{
								duration: 0.6,
								delay: 0.05 * i,
								ease: [0.22, 1, 0.36, 1],
							}}
							className="group relative overflow-hidden rounded-2xl border border-border bg-card/30 p-6 transition-all duration-500 hover:border-foreground/20 hover:bg-card/60"
						>
							<reason.Icon
								className="mb-6 h-5 w-5 text-foreground/55 transition-colors duration-500 group-hover:text-foreground"
								strokeWidth={1.75}
							/>
							<h3 className="mb-2 font-medium text-[15px] text-foreground leading-tight tracking-tight">
								{reason.title}
							</h3>
							<p className="text-balance text-foreground/55 text-sm leading-relaxed">
								{reason.body}
							</p>
						</motion.div>
					))}
				</div>
			</Container>
		</section>
	);
}
