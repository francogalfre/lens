import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Upgrade to Premium",
	description: "Three full analyses every day. Cancel any time.",
};

export default function UpgradeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
