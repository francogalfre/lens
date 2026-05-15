"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";

export const ServerErrorBanner = ({ message }: { message: string | null }) => (
	<AnimatePresence>
		{message && (
			<motion.div
				key={message}
				initial={{ opacity: 0, y: -4 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -4 }}
				transition={{ duration: 0.2 }}
				role="alert"
				className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/6 px-3.5 py-2.5"
			>
				<ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
				<p className="text-destructive text-sm leading-snug">{message}</p>
			</motion.div>
		)}
	</AnimatePresence>
);
