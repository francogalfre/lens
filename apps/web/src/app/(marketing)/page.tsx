"use client";

import { useRouter } from "next/navigation";

import { FAQ } from "@/components/landing/sections/faq";
import { FinalCTA } from "@/components/landing/sections/final-cta";
import { Hero } from "@/components/landing/sections/hero";
import { HowItWorks } from "@/components/landing/sections/how-it-works";
import { WhyLens } from "@/components/landing/sections/why-lens";
import { Footer } from "@/components/layout/footer";
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
		<>
			<Hero
				onSubmit={handleSubmit}
				isRunning={false}
				isPendingAuth={isPending}
			/>
			<HowItWorks />
			<WhyLens />
			<FAQ />
			<FinalCTA />
			<Footer />
		</>
	);
}
