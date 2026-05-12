"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const { data: session, isPending } = authClient.useSession();

	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!isPending && !session) {
			router.replace(`/login?callbackUrl=${pathname}`);
		}
	}, [session, isPending, router, pathname]);

	if (isPending || !session) return null;

	return <>{children}</>;
}
