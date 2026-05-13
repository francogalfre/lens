"use client";

import { TextScramble } from "@lens/ui/components/text-scramble";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { Container } from "@/components/layout/container";
import { AgentPipeline } from "../agent-pipeline";

export function HowItWorks() {
	const headingRef = useRef<HTMLDivElement>(null);
	const inView = useInView(headingRef, { once: true, margin: "-15% 0px" });

	return (
		<section className="w-full pt-12 pb-24 sm:pt-24">
			<Container>
				<motion.div
					ref={headingRef}
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-15% 0px" }}
					transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					className="mb-12 flex flex-col items-center gap-4 text-center sm:mb-16"
				>
					<div className="font-medium text-4xl text-foreground leading-[1.1] tracking-tight sm:text-5xl">
						<TextScramble
							as="span"
							trigger={inView}
							duration={1}
							speed={0.04}
							className="block"
						>
							Six agents.
						</TextScramble>
						<TextScramble
							as="span"
							trigger={inView}
							duration={1.1}
							speed={0.04}
							className="block text-foreground/45"
						>
							One verdict.
						</TextScramble>
					</div>
					<p className="max-w-md text-balance text-foreground/55 text-sm leading-relaxed sm:text-base">
						Each agent has a job. They run in parallel where they can, in
						sequence where they must.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 32 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-10% 0px" }}
					transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
				>
					<AgentPipeline />
				</motion.div>
			</Container>
		</section>
	);
}
