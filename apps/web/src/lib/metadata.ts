import type { Metadata } from "next";

const APP_URL = "https://lens.sh";

export const metadata: Metadata = {
	metadataBase: new URL(APP_URL),
	title: {
		default: "Lens - Idea Analysis",
		template: "%s | Lens",
	},
	description:
		"Transform your ideas into actionable insights. Lens uses AI agents to analyze market opportunities, assess risks, and evaluate feasibility.",
	keywords: [
		"AI",
		"idea analysis",
		"startup",
		"business intelligence",
		"market research",
		"feasibility analysis",
	],
	authors: [{ name: "Lens" }],
	creator: "Lens",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: APP_URL,
		title: "Lens - AI-Powered Idea Analysis",
		description:
			"Transform your ideas into actionable insights with AI agents that analyze market opportunities, risks, and feasibility.",
		siteName: "Lens",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Lens - AI Idea Analysis",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Lens - AI-Powered Idea Analysis",
		description: "Transform your ideas into actionable insights with AI agents",
		images: ["/og-image.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "google-site-verification-code",
	},
};
