"use client";

import {
	ArrowRightStartOnRectangleIcon,
	SparklesIcon,
	Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@lens/ui/components/dropdown-menu";
import { Skeleton } from "@lens/ui/components/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

function getInitials(name: string) {
	const parts = name.trim().split(/\s+/);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="h-8 w-8 rounded-full" />;
	}

	if (!session) {
		return (
			<Link
				href="/login"
				className="inline-flex h-8 items-center justify-center rounded-full bg-foreground px-4 font-medium text-background text-xs transition-all hover:bg-foreground/90 hover:opacity-95"
			>
				Sign in
			</Link>
		);
	}

	const initials = getInitials(session.user.name);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button
						type="button"
						className="group inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card font-medium text-[11px] tracking-tight transition-all hover:border-foreground/30 hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
						aria-label="Account menu"
					/>
				}
			>
				<span className="select-none">{initials}</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="min-w-[240px] rounded-2xl border border-border bg-card/95 p-1.5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:bg-card/90"
				align="end"
				sideOffset={8}
			>
				<div className="flex items-center gap-3 px-2.5 py-2.5">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.06] font-medium text-[12px] text-foreground/80">
						{initials}
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate font-medium text-sm leading-tight">
							{session.user.name}
						</p>
						<p className="mt-0.5 truncate text-foreground/50 text-xs">
							{session.user.email}
						</p>
					</div>
				</div>

				<DropdownMenuSeparator className="mx-1 my-1 bg-border/60" />

				<DropdownMenuItem
					render={<Link href="/dashboard" />}
					className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-sm focus:bg-foreground/[0.04]"
				>
					<Squares2X2Icon className="h-4 w-4 text-foreground/55" />
					<span>Dashboard</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					render={<Link href="/upgrade" />}
					className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-sm focus:bg-foreground/[0.04]"
				>
					<SparklesIcon className="h-4 w-4 text-foreground/55" />
					<span>Upgrade to Pro</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator className="mx-1 my-1 bg-border/60" />

				<DropdownMenuItem
					onClick={() => {
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => router.push("/"),
							},
						});
					}}
					className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-foreground/70 text-sm focus:bg-foreground/[0.04] focus:text-foreground"
				>
					<ArrowRightStartOnRectangleIcon className="h-4 w-4" />
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
