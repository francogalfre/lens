"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	useEffect(() => {
		if (!isPending && session) {
			router.replace("/");
		}
	}, [session, isPending, router]);

	if (isPending || session) return null;

	return (
		<div className="fixed inset-0 z-[100] overflow-auto bg-background">
			<div
				aria-hidden
				className="mask-[radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
				style={{
					backgroundImage:
						"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
					backgroundSize: "44px 44px",
				}}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute top-0 left-1/2 h-64 w-[640px] -translate-x-1/2 rounded-full bg-foreground/[0.04] blur-3xl"
			/>
			<div className="relative flex min-h-full items-center justify-center px-4 py-16">
				{children}
			</div>
		</div>
	);
}
