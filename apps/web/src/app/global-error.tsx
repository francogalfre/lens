"use client";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en">
			<body>
				<div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 text-center">
					<h2 className="font-medium text-2xl tracking-tight">
						Something broke
					</h2>
					<p className="mt-2 text-sm opacity-70">
						{error.message || "An unexpected error occurred."}
					</p>
					<button
						type="button"
						onClick={() => reset()}
						className="mt-6 rounded-full bg-black px-4 py-2 font-medium text-sm text-white"
					>
						Reload
					</button>
				</div>
			</body>
		</html>
	);
}
