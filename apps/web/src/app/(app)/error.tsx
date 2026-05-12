"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

export default function AppError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center px-6 py-16 text-center">
			<h2 className="font-medium text-2xl text-foreground tracking-tight">
				Something went wrong
			</h2>
			<p className="mt-2 text-foreground/55 text-sm">
				We hit an unexpected error. Try again in a moment.
			</p>
			<button
				type="button"
				onClick={() => reset()}
				className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 font-medium text-background text-sm transition-all hover:bg-foreground/90"
			>
				<ArrowPathIcon className="h-4 w-4" />
				Try again
			</button>
		</div>
	);
}
