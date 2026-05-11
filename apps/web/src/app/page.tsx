"use client";

import { useRouter } from "next/navigation";
import { Hero } from "@/components/landing/hero";
import { authClient } from "@/lib/auth-client";

export default function Home() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const handleSubmit = (idea: string) => {
		if (!idea.trim()) return;
		if (!session) {
			sessionStorage.setItem("analyzingIdea", idea);
			router.push("/login?callbackUrl=/analyze");
			return;
		}
		sessionStorage.setItem("analyzingIdea", idea);
		router.push("/analyze");
	};

	return (
		<Hero onSubmit={handleSubmit} isRunning={false} isPendingAuth={isPending} />
	);
}
