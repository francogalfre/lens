"use client";

import { Globe, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { IdeaInput } from "@/components/analysis/idea-input";
import { authClient } from "@/lib/auth-client";

const FEATURES = [
	{
		icon: Globe,
		title: "Market research",
		description:
			"Discovers real competitors and market signals via live web search",
	},
	{
		icon: ShieldAlert,
		title: "Risk analysis",
		description: "Identifies weaknesses, risks, and critical assumptions",
	},
	{
		icon: Lightbulb,
		title: "Opportunity scouting",
		description: "Finds gaps and differentiators you can actually exploit",
	},
];

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
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-12">
			<div className="w-full max-w-2xl space-y-8">
				{/* Hero */}
				<header className="text-center">
					<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-3.5 py-1.5">
						<Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
						<span className="text-muted-foreground text-xs">
							AI-powered analysis
						</span>
					</div>
					<h1 className="font-semibold text-[2.75rem] leading-none tracking-tight sm:text-6xl">
						What&apos;s your idea?
					</h1>
					<p className="mt-4 text-base text-muted-foreground sm:text-lg">
						Describe it briefly — our agents analyze the market,
						<br className="hidden sm:block" /> assess risks, and find
						opportunities.
					</p>
				</header>

				<IdeaInput
					onSubmit={handleSubmit}
					isRunning={false}
					isPendingAuth={isPending}
				/>

				{/* Feature cards */}
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{FEATURES.map(({ icon: Icon, title, description }) => (
						<div
							key={title}
							className="space-y-2 rounded-2xl border border-border/40 bg-card/40 p-4"
						>
							<Icon className="h-4 w-4 text-muted-foreground/70" />
							<p className="font-medium text-foreground/80 text-sm">{title}</p>
							<p className="text-muted-foreground text-xs leading-relaxed">
								{description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
