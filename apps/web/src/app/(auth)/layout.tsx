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
		<main className="flex min-h-[calc(100svh-3rem)] items-center justify-center px-4">
			{children}
		</main>
	);
}
