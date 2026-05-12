import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Your analyses",
	description: "A running log of every idea you've put under the lens.",
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
