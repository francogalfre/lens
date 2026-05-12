import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Analyzing your idea",
	description: "Six specialized agents reviewing your idea in real time.",
};

export default function AnalyzeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
