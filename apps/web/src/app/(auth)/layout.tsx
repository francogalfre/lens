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
		<div className="fixed inset-0 z-[100] overflow-auto bg-[#0c0c0c]">
			{/* Ambient top glow */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse 80% 40% at 50% -10%, rgba(255,255,255,0.05) 0%, transparent 70%)",
				}}
			/>
			<div className="relative flex min-h-full items-center justify-center px-4 py-16">
				{children}
			</div>
		</div>
	);
}
