"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { AnalysesList } from "./components/analyses-list";

const DashboardHeader = () => (
	<motion.div
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
		className="mb-10 flex items-end justify-between gap-4"
	>
		<div>
			<h1 className="font-medium text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
				Your analyses
			</h1>
			<p className="mt-1.5 text-foreground/55 text-sm">
				A running log of every idea you&apos;ve put under the lens.
			</p>
		</div>
		<Link
			href="/"
			className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 font-medium text-background text-xs transition-all hover:scale-[1.02] hover:bg-foreground/90"
		>
			<PlusIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
			<span className="hidden sm:inline">New analysis</span>
			<span className="sm:hidden">New</span>
		</Link>
	</motion.div>
);

const DashboardPage = () => (
	<>
		<div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
			<DashboardHeader />
			<AnalysesList />
		</div>
		<Footer />
	</>
);

export default DashboardPage;
