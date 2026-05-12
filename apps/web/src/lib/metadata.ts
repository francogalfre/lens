import type { Metadata } from "next";

const APP_URL = "https://lens.sh";

export const metadata: Metadata = {
	metadataBase: new URL(APP_URL),
	title: {
		default: "Lens",
		template: "%s | Lens",
	},
	description:
		"Analyze your business ideas with AI. Discover hidden opportunities and market insights.",
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
	icons: {
		icon: [
			{ url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
			{ url: "/favicon-light.png", media: "(prefers-color-scheme: light)" },
		],
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: APP_URL,
		title: "Lens — AI-powered idea analysis",
		description:
			"Analyze your business ideas with AI. Discover hidden opportunities and market insights.",
		siteName: "Lens",
	},
	twitter: {
		card: "summary_large_image",
		title: "Lens — AI-powered idea analysis",
		description:
			"Analyze your business ideas with AI. Discover hidden opportunities and market insights.",
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
	alternates: {
		canonical: APP_URL,
	},
};
