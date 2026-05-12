"use client";

import { TextScramble } from "@lens/ui/components/text-scramble";
import { motion } from "motion/react";
import Image from "next/image";

import lensLogo from "@/assets/lens.svg";
import { Container } from "@/components/layout/container";

import { IdeaInputMinimal } from "../idea-input-minimal";

interface HeroProps {
	onSubmit: (idea: string) => void;
	isRunning: boolean;
	isPendingAuth: boolean;
}

export function Hero({ onSubmit, isRunning, isPendingAuth }: HeroProps) {
	return (
		<section className="relative flex min-h-[min(680px,calc(100svh-2rem))] flex-col items-center justify-center pt-24 pb-16 sm:pt-28 sm:pb-20">
			<div
				aria-hidden
				className="mask-[radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.06]"
				style={{
					backgroundImage:
						"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
					backgroundSize: "44px 44px",
				}}
			/>

			<Container>
				<div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col items-center gap-5">
					<motion.div
						initial={{ opacity: 0, scale: 0.94 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
						className="relative size-20"
					>
						<motion.div
							animate={{ y: [-4, -10, -4] }}
							transition={{
								duration: 4,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
								type: "tween",
							}}
							className="relative size-20"
						>
							<Image
								src={lensLogo}
								alt="Lens"
								fill
								priority
								sizes="80px"
								className="block select-none object-contain dark:brightness-0 dark:invert"
							/>
						</motion.div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.7,
							delay: 0.15,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="flex flex-col items-center gap-4 text-center"
					>
						<div
							aria-hidden
							className="flex flex-col items-center font-medium text-foreground leading-[1.05] tracking-tight"
						>
							<TextScramble
								as="h1"
								duration={1.2}
								speed={0.045}
								className="block text-balance text-4xl sm:text-5xl"
							>
								See what others don't
							</TextScramble>
						</div>

						<p className="w-full max-w-2xl text-balance text-base text-foreground/55 leading-relaxed">
							Six agents inspect your idea from every angle. Market, risk,
							feasibility, opportunity — a verdict in seconds.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
						className="w-full"
					>
						<IdeaInputMinimal
							onSubmit={onSubmit}
							isRunning={isRunning}
							isPendingAuth={isPendingAuth}
						/>
					</motion.div>
				</div>
			</Container>
		</section>
	);
}
