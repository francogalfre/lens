"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";

import { Container } from "@/components/layout/container";

export function FinalCTA() {
	return (
		<section className="w-full py-16">
			<Container>
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-15% 0px" }}
					transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					className="relative overflow-hidden rounded-3xl border border-border bg-card/60 px-8 py-12 sm:px-12"
				>
					<div
						aria-hidden
						className="pointer-events-none absolute top-0 left-1/2 h-44 w-[480px] -translate-x-1/2 rounded-full bg-foreground/[0.06] blur-3xl"
					/>

					<div className="relative flex flex-col items-center gap-5 text-center">
						<h2 className="font-medium text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl">
							See it for <span className="font-light italic">yourself.</span>
						</h2>
						<p className="max-w-sm text-balance text-foreground/55 text-sm leading-relaxed">
							One minute. One idea. A second opinion you can trust.
						</p>
						<Link
							href="/"
							className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-medium text-background text-sm transition-all hover:scale-[1.02] hover:bg-foreground/90"
						>
							Analyze an idea
							<ArrowRightIcon
								className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
								strokeWidth={2.5}
							/>
						</Link>
					</div>
				</motion.div>
			</Container>
		</section>
	);
}
