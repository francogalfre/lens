"use client";

import { motion } from "motion/react";
import { AsciiEye } from "./ascii-eye";
import { IdeaInputMinimal } from "./idea-input-minimal";

interface HeroProps {
	onSubmit: (idea: string) => void;
	isRunning: boolean;
	isPendingAuth: boolean;
}

export function Hero({ onSubmit, isRunning, isPendingAuth }: HeroProps) {
	return (
		<section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-20">
			<div className="flex w-full min-w-0 max-w-3xl flex-col items-center gap-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="flex flex-col items-center gap-8"
				>
					<AsciiEye />

					<div className="flex flex-col items-center gap-4 text-center">
						<h1 className="bg-gradient-to-r from-[#FF3E3E] to-[#FF6B6B] bg-clip-text font-bold text-4xl text-transparent tracking-tight sm:text-5xl">
							See what others don&apos;t
						</h1>
						<p className="max-w-md text-base text-white/50 sm:text-lg">
							Turn your startup idea into actionable intelligence — competitors,
							viability, and a clear next step.
						</p>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
				>
					<IdeaInputMinimal
						onSubmit={onSubmit}
						isRunning={isRunning}
						isPendingAuth={isPendingAuth}
					/>
				</motion.div>
			</div>
		</section>
	);
}
