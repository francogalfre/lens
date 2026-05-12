import "../index.css";
import { Header } from "@/components/layout/header";
import { fontMono, fontSans } from "@/lib/fonts";
import { Providers } from "@/lib/providers";

export { metadata } from "@/lib/metadata";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${fontSans.variable} ${fontMono.variable} min-h-screen antialiased`}
			>
				<Providers>
					<div className="flex min-h-screen flex-col">
						<Header />
						<main className="flex flex-1 flex-col pt-16">{children}</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
