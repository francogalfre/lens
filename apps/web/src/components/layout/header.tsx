"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

import { UsageBadge } from "@/components/subscription/usage-badge";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";

export function Header() {
	const { scrollY } = useScroll();
	const [scrolled, setScrolled] = useState(false);

	useMotionValueEvent(scrollY, "change", (latest) => {
		setScrolled(latest > 24);
	});

	return (
		<div className="pointer-events-none fixed top-0 left-0 z-40 flex w-full justify-center px-3 pt-3 sm:px-4 sm:pt-5">
			<motion.header
				initial={false}
				animate={{
					maxWidth: scrolled ? 720 : 1280,
					borderRadius: scrolled ? 999 : 18,
				}}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				className="pointer-events-auto w-full border border-border bg-card/70 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150 dark:border-border dark:bg-card/80 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
			>
				<motion.div
					animate={{
						paddingTop: scrolled ? 10 : 12,
						paddingBottom: scrolled ? 10 : 12,
						paddingLeft: scrolled ? 18 : 20,
						paddingRight: scrolled ? 10 : 20,
					}}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="flex items-center justify-between gap-4"
				>
					<Logo />
					<div className="flex items-center gap-1.5">
						<UsageBadge />
						<ModeToggle />
						<UserMenu />
					</div>
				</motion.div>
			</motion.header>
		</div>
	);
}
