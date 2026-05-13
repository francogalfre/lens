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
		<section className="relative flex min-h-[90vh] flex-col items-center justify-center pt-16 pb-16 sm:pt-20 sm:pb-20">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.06]"
				style={{
					backgroundImage:
						"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
					backgroundSize: "44px 44px",
					maskImage:
						"radial-gradient(ellipse 70% 50% at 50% 50%, black 0%, black 20%, transparent 100%)",
					WebkitMaskImage:
						"radial-gradient(ellipse 70% 50% at 50% 50%, black 0%, black 20%, transparent 100%)",
				}}
			/>

			<Container>
				<div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col items-center gap-5 sm:gap-6">
					<motion.div
						initial={{ opacity: 0, scale: 0.94 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
						className="relative size-24 sm:size-28"
					>
						<motion.div
							animate={{ y: [-3, -8, -3] }}
							transition={{
								duration: 4,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
								type: "tween",
							}}
							className="relative size-28 sm:size-32"
						>
							<Image
								src={lensLogo}
								alt="Lens"
								fill
								priority
								sizes="128px"
								loading="eager"
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
							className="flex w-full flex-col items-center font-medium text-foreground leading-[1.05] tracking-tight"
						>
							<TextScramble
								as="h1"
								duration={1.2}
								speed={0.045}
								className="block max-w-xl text-balance text-4xl sm:text-5xl lg:text-6xl"
							>
								See what others don't
							</TextScramble>
						</div>

						<p className="w-full max-w-xl text-balance text-base text-foreground/55 leading-relaxed">
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
