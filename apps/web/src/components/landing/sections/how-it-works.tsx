"use client";

import {
	GlobeAltIcon,
	LightBulbIcon,
	MagnifyingGlassIcon,
	ShieldExclamationIcon,
	SparklesIcon,
	WrenchIcon,
} from "@heroicons/react/24/outline";
import { motion } from "motion/react";

import { Container } from "@/components/layout/container";
import { AgentPipeline } from "../agent-pipeline";

const AGENTS = [
	{
		num: "01",
		label: "Parser",
		Icon: MagnifyingGlassIcon,
		title: "Reads your idea",
		body: "Extracts the problem, the solution, the audience and the domain — turning prose into structure.",
		span: "md:col-span-7",
	},
	{
		num: "02",
		label: "Researcher",
		Icon: GlobeAltIcon,
		title: "Studies the market",
		body: "Crawls competitors, queries trends, gathers signal.",
		span: "md:col-span-5",
	},
	{
		num: "03",
		label: "Critic",
		Icon: ShieldExclamationIcon,
		title: "Hunts the cracks",
		body: "Stress-tests assumptions and names the risks that could end it.",
		span: "md:col-span-4",
	},
	{
		num: "04",
		label: "Opportunity",
		Icon: LightBulbIcon,
		title: "Finds the edge",
		body: "Looks for unfair advantages, gaps, real differentiation.",
		span: "md:col-span-4",
	},
	{
		num: "05",
		label: "Feasibility",
		Icon: WrenchIcon,
		title: "Maps the build",
		body: "Complexity, stack, timeline — what it actually takes.",
		span: "md:col-span-4",
	},
	{
		num: "06",
		label: "Synthesis",
		Icon: SparklesIcon,
		title: "Delivers a verdict",
		body: "Weighs every signal and writes a clear recommendation with a 0–10 viability score.",
		span: "md:col-span-12",
	},
] as const;

export function HowItWorks() {
	return (
		<section className="w-full pt-12 pb-24 sm:pt-24">
			<Container>
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-15% 0px" }}
					transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					className="mb-12 flex flex-col items-center gap-4 text-center sm:mb-16"
				>
					<h2 className="font-medium text-4xl text-foreground leading-[1.1] tracking-tight sm:text-5xl">
						Six agents.
						<br />
						<span className="text-foreground/45">One verdict.</span>
					</h2>
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
					className="mb-6"
				>
					<AgentPipeline />
				</motion.div>

				<div className="grid grid-cols-1 gap-3 md:grid-cols-12">
					{AGENTS.map((agent, i) => (
						<BentoCard key={agent.num} agent={agent} index={i} />
					))}
				</div>
			</Container>
		</section>
	);
}

function BentoCard({
	agent,
	index,
}: {
	agent: (typeof AGENTS)[number];
	index: number;
}) {
	const { num, label, Icon, title, body, span } = agent;
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-10% 0px" }}
			transition={{
				duration: 0.6,
				delay: 0.05 * index,
				ease: [0.22, 1, 0.36, 1],
			}}
			className={`group relative col-span-1 overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-all duration-500 hover:border-foreground/20 hover:bg-card/70 sm:p-7 ${span}`}
		>
			<div className="mb-8 flex items-start justify-between">
				<div className="flex items-center gap-2.5">
					<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground/70 transition-colors duration-500 group-hover:bg-foreground group-hover:text-background">
						<Icon className="h-4 w-4" strokeWidth={2} />
					</span>
					<span className="text-foreground/55 text-xs">{label}</span>
				</div>
				<span className="text-foreground/30 text-xs tabular-nums">{num}</span>
			</div>

			<h3 className="mb-2 font-medium text-foreground text-lg leading-tight tracking-tight">
				{title}
			</h3>
			<p className="text-balance text-foreground/55 text-sm leading-relaxed">
				{body}
			</p>
		</motion.div>
	);
}
