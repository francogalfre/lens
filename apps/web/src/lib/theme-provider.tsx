"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider
			{...props}
			enableSystem={false}
			disableTransitionOnChange={false}
			attribute="class"
			defaultTheme="dark"
			themes={["light", "dark"]}
		>
			{children}
		</NextThemesProvider>
	);
}
