"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function AnalyzeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	useEffect(() => {
		if (!isPending && !session) {
			router.replace("/login?callbackUrl=/analyze");
		}
	}, [session, isPending, router]);

	if (isPending || !session) return null;

	return <>{children}</>;
}
