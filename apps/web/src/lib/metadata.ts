import type { Metadata } from "next";

const APP_URL = "https://lens.sh";

export const metadata: Metadata = {
	metadataBase: new URL(APP_URL),
	title: {
		default: "Lens — Validate Your Startup Idea with AI",
		template: "%s | Lens",
	},
	description:
		"Six specialized AI agents stress-test your startup idea in under a minute. Get instant feedback on market fit, competition, feasibility, risks, and opportunities — before you write a single line of code.",
	keywords: [
		"startup idea validator",
		"AI idea analysis",
		"startup feasibility tool",
		"business idea checker",
		"market research AI",
		"competitive analysis AI",
		"startup validation",
		"idea testing tool",
		"entrepreneur AI tool",
		"MVP validation",
		"product market fit",
		"startup risk analysis",
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
		title: "Lens — Validate Your Startup Idea with AI",
		description:
			"Six specialized AI agents stress-test your startup idea in under a minute. Market fit, competition, feasibility, risks, and opportunities — instantly.",
		siteName: "Lens",
		images: [
			{
				url: "/lens-og.jpeg",
				width: 1200,
				height: 630,
				alt: "Lens — AI-powered startup idea validation",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Lens — Validate Your Startup Idea with AI",
		description:
			"Six specialized AI agents stress-test your startup idea in under a minute. Market fit, competition, feasibility, risks, and opportunities — instantly.",
		images: ["/lens-og.jpeg"],
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
