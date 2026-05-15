"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";

export const SuccessHeader = () => (
	<div className="flex flex-col items-center px-8 pt-10 pb-6 text-center">
		<motion.div
			initial={{ scale: 0.4, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ delay: 0.25, type: "spring", stiffness: 220 }}
			className="rounded-full bg-foreground/5 p-3 ring-1 ring-foreground/10"
		>
			<motion.span
				initial={{ scale: 0.4 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.4, type: "spring", stiffness: 260 }}
				className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background"
			>
				<CheckIcon className="h-5 w-5" strokeWidth={3} />
			</motion.span>
		</motion.div>
		<h1 className="mt-5 font-medium text-2xl text-foreground leading-tight tracking-tight">
			Welcome to Premium
		</h1>
		<p className="mt-1.5 text-foreground/55 text-sm">
			Your subscription is active. Time to put more ideas under the lens.
		</p>
	</div>
);
