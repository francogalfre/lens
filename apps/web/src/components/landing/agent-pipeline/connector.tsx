"use client";

import { motion } from "motion/react";

export const HorizontalConnector = ({ active }: { active: boolean }) => (
	<div className="relative hidden items-center justify-center lg:flex">
		<svg
			className="h-3 w-full"
			viewBox="0 0 60 12"
			preserveAspectRatio="xMidYMid meet"
			fill="none"
		>
			<title>Connector</title>
			<motion.path
				d="M 2 6 L 52 6"
				stroke="currentColor"
				strokeWidth="0.6"
				strokeDasharray="2 2.5"
				className="text-foreground/15"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.5 }}
			/>
			<motion.path
				d="M 2 6 L 52 6"
				stroke="currentColor"
				strokeWidth="0.75"
				className="text-foreground/70"
				initial={{ pathLength: 0, opacity: 0 }}
				animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
				transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
			/>
			<motion.path
				d="M 50 3.5 L 54 6 L 50 8.5"
				stroke="currentColor"
				strokeWidth="0.75"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-foreground/70"
				initial={{ opacity: 0.25 }}
				animate={{ opacity: active ? 1 : 0.25 }}
				transition={{ duration: 0.4, delay: active ? 0.4 : 0 }}
			/>
			{active && (
				<motion.circle
					r="1.25"
					fill="currentColor"
					className="text-foreground"
					initial={{ offsetDistance: "0%", opacity: 0 }}
					animate={{
						offsetDistance: "100%",
						opacity: [0, 1, 1, 0],
					}}
					transition={{
						duration: 1.4,
						ease: "linear",
						repeat: Number.POSITIVE_INFINITY,
					}}
					style={{ offsetPath: 'path("M 2 6 L 52 6")' }}
				/>
			)}
		</svg>
	</div>
);

export const VerticalConnector = ({ active }: { active: boolean }) => (
	<div className="flex items-center justify-center py-1">
		<svg
			className="h-6 w-full max-w-[60px]"
			viewBox="0 0 12 24"
			preserveAspectRatio="xMidYMid meet"
			fill="none"
			role="img"
			aria-label="Flow connection"
		>
			<motion.path
				d="M 6 0 L 6 20"
				stroke="currentColor"
				strokeWidth="0.6"
				strokeDasharray="2 2"
				className="text-foreground/15"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.5 }}
			/>
			<motion.path
				d="M 6 0 L 6 20"
				stroke="currentColor"
				strokeWidth="0.75"
				className="text-foreground/70"
				initial={{ pathLength: 0, opacity: 0 }}
				animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
			/>
			<motion.path
				d="M 3 17 L 6 20 L 9 17"
				stroke="currentColor"
				strokeWidth="0.75"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-foreground/70"
				initial={{ opacity: 0.25 }}
				animate={{ opacity: active ? 1 : 0.25 }}
				transition={{ duration: 0.3, delay: active ? 0.3 : 0 }}
			/>
		</svg>
	</div>
);
