"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { TextScramble } from "@lens/ui/components/text-scramble";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

import { Container } from "@/components/layout/container";

const QUESTIONS = [
	{
		q: "How is this different from asking ChatGPT?",
		a: "One general model gives you one perspective. Lens orchestrates six specialized agents that run in parallel — each with its own prompt, tools, and constraints — then synthesizes a verdict. You get conflicting takes resolved, not averaged.",
	},
	{
		q: "Does it actually search the web?",
		a: "Yes. The Researcher agent uses live web search to surface real competitors, market signal, and trend data. It cites what it finds so you can verify.",
	},
	{
		q: "What happens to my ideas?",
		a: "Your inputs are encrypted at rest and never used to train models. Analyses are private to your account. You can delete them at any time.",
	},
	{
		q: "How accurate is the score?",
		a: "The 0–10 score is a directional signal, not an oracle. Treat it as a starting point — the recommendations and risks matter more than the number.",
	},
	{
		q: "Can I use this for non-startup ideas?",
		a: "Lens works best for product, feature, and venture ideas. For pure research questions or essays, you're better off with a chat tool.",
	},
];

export function FAQ() {
	const headRef = useRef<HTMLDivElement>(null);
	const inView = useInView(headRef, { once: true, margin: "-15% 0px" });

	return (
		<section className="w-full py-24">
			<Container>
				<motion.div
					ref={headRef}
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-15% 0px" }}
					transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					className="mb-12 flex flex-col items-start gap-3 sm:items-center sm:text-center"
				>
					<div className="font-medium text-4xl text-foreground leading-[1.1] tracking-tight sm:text-5xl">
						<TextScramble
							as="span"
							trigger={inView}
							duration={1}
							speed={0.04}
							className="block"
						>
							Questions,
						</TextScramble>
						<TextScramble
							as="span"
							trigger={inView}
							duration={1.1}
							speed={0.04}
							className="block text-foreground/45"
						>
							answered.
						</TextScramble>
					</div>
				</motion.div>

				<div className="space-y-2">
					{QUESTIONS.map((item, i) => (
						<FAQItem key={item.q} item={item} index={i} />
					))}
				</div>
			</Container>
		</section>
	);
}

function FAQItem({
	item,
	index,
}: {
	item: { q: string; a: string };
	index: number;
}) {
	const [open, setOpen] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-5% 0px" }}
			transition={{
				duration: 0.5,
				delay: 0.05 * index,
				ease: [0.22, 1, 0.36, 1],
			}}
			className="overflow-hidden rounded-2xl border border-border bg-card/30 transition-colors duration-300 hover:border-foreground/15"
		>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-foreground/[0.015]"
				aria-expanded={open}
			>
				<span className="font-medium text-[15px] text-foreground tracking-tight">
					{item.q}
				</span>
				<motion.span
					animate={{ rotate: open ? 45 : 0 }}
					transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-foreground/60"
				>
					<PlusIcon className="h-3.5 w-3.5" />
				</motion.span>
			</button>
			<motion.div
				initial={false}
				animate={{
					height: open ? "auto" : 0,
					opacity: open ? 1 : 0,
				}}
				transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
				className="overflow-hidden"
			>
				<div className="px-5 pb-5">
					<p className="text-balance text-foreground/65 text-sm leading-relaxed">
						{item.a}
					</p>
				</div>
			</motion.div>
		</motion.div>
	);
}
