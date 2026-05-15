"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";
import { Suspense } from "react";

import { Footer } from "@/components/layout/footer";
import { PlanCard, PlanCardSkeleton } from "./components/plan-card";

const PageHeader = () => (
	<motion.div
		initial={{ opacity: 0, y: 16 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
		className="mb-10 text-center"
	>
		<h1 className="font-medium text-4xl text-foreground leading-tight tracking-tight">
			Go <span className="font-light italic">Premium.</span>
		</h1>
		<p className="mt-3 text-balance text-foreground/55 text-sm leading-relaxed">
			Three full analyses every day. Cancel any time.
		</p>
	</motion.div>
);

const BackLink = () => (
	<motion.div
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
	>
		<Link
			href="/"
			className="mb-10 inline-flex items-center gap-1.5 text-foreground/55 text-xs transition-colors hover:text-foreground"
		>
			<ArrowLeftIcon className="h-3.5 w-3.5" />
			Back
		</Link>
	</motion.div>
);

const UpgradePage = () => (
	<>
		<div className="mx-auto w-full max-w-md flex-1 px-6 py-16">
			<BackLink />
			<PageHeader />
			<Suspense fallback={<PlanCardSkeleton />}>
				<PlanCard />
			</Suspense>
		</div>
		<Footer />
	</>
);

export default UpgradePage;
