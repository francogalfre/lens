"use client";

import { UsageBadge } from "@/components/subscription/usage-badge";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";

export function Header() {
	return (
		<header className="sticky top-0 z-40 w-full border-border/50 border-b bg-background/90 backdrop-blur-sm">
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
				<Logo />
				<div className="flex items-center gap-3">
					<UsageBadge />
					<UserMenu />
				</div>
			</div>
		</header>
	);
}
