"use client";

import { motion } from "motion/react";

interface FloatingPathsProps {
	position?: number;
	pathCount?: number;
	className?: string;
}

export function FloatingPaths({
	position = 1,
	pathCount = 36,
	className,
}: FloatingPathsProps) {
	const paths = Array.from({ length: pathCount }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		width: 0.5 + i * 0.03,
	}));

	return (
		<div className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
			<svg
				className="h-full w-full text-foreground/60"
				viewBox="0 0 696 316"
				fill="none"
				aria-hidden
			>
				<title>Background paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.08 + path.id * 0.018}
						initial={{ pathLength: 0.3, opacity: 0.5 }}
						animate={{
							pathLength: 1,
							opacity: [0.25, 0.5, 0.25],
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: 22 + Math.random() * 8,
							repeat: Number.POSITIVE_INFINITY,
							ease: "linear",
						}}
					/>
				))}
			</svg>
		</div>
	);
}
