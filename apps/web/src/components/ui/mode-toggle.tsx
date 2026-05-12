"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const current = (theme === "system" ? resolvedTheme : theme) ?? "light";
	const isDark = current === "dark";

	const toggle = () => setTheme(isDark ? "light" : "dark");

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
			className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
		>
			<AnimatePresence mode="wait" initial={false}>
				{mounted ? (
					<motion.span
						key={isDark ? "moon" : "sun"}
						initial={{ rotate: -90, opacity: 0, scale: 0.85 }}
						animate={{ rotate: 0, opacity: 1, scale: 1 }}
						exit={{ rotate: 90, opacity: 0, scale: 0.85 }}
						transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
						className="flex items-center justify-center"
					>
						{isDark ? (
							<MoonIcon className="h-4 w-4" />
						) : (
							<SunIcon className="h-4 w-4" />
						)}
					</motion.span>
				) : (
					<span className="h-4 w-4" aria-hidden />
				)}
			</AnimatePresence>
		</button>
	);
}
