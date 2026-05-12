"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { FloatingPaths } from "@lens/ui/components/floating-paths";
import { Loader } from "@lens/ui/components/loading-breadcrumb";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

import lensLogo from "@/assets/lens.svg";
import { authClient } from "@/lib/auth-client";

function isSafeCallback(path: string | null): string {
	if (!path) return "/";
	if (!path.startsWith("/") || path.startsWith("//")) return "/";
	return path;
}

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	useEffect(() => {
		if (isPending || !session) return;
		const params = new URLSearchParams(window.location.search);
		const callbackUrl = isSafeCallback(params.get("callbackUrl"));
		router.replace(callbackUrl as never);
	}, [session, isPending, router]);

	if (isPending || session) return null;

	return (
		<div className="fixed inset-0 z-[100] overflow-auto bg-background">
			<main className="relative min-h-full lg:grid lg:grid-cols-2">
				<aside className="relative hidden h-screen flex-col overflow-hidden border-border/60 border-r bg-muted/40 p-10 lg:flex">
					<div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />

					<div className="relative z-10 flex items-center gap-2.5">
						<Image
							src={lensLogo}
							alt="Lens"
							width={26}
							height={26}
							priority
							className="dark:invert"
						/>
						<span className="font-semibold text-foreground text-lg tracking-tight">
							Lens
						</span>
					</div>

					<div className="relative z-10 mt-auto max-w-sm">
						<p className="text-balance font-medium text-2xl text-foreground leading-tight tracking-tight">
							Put your ideas under the lens — before you put them on the
							roadmap.
						</p>
						<p className="mt-3 text-foreground/55 text-sm">
							Six expert agents stress-test feasibility, market fit, risk and
							edge in under a minute.
						</p>
					</div>
				</aside>

				<section className="relative flex min-h-screen flex-col justify-center px-4 py-16 sm:px-6">
					<Link
						href="/"
						className="absolute top-6 left-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-foreground/55 text-xs transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
					>
						<ChevronLeftIcon className="h-3.5 w-3.5" />
						Home
					</Link>

					<div className="mx-auto w-full max-w-sm">
						<div className="mb-8 flex items-center gap-2.5 lg:hidden">
							<Image
								src={lensLogo}
								alt="Lens"
								width={24}
								height={24}
								priority
								className="dark:invert"
							/>
							<span className="font-semibold text-base text-foreground tracking-tight">
								Lens
							</span>
						</div>
						<Suspense
							fallback={
								<div className="flex justify-center py-10">
									<Loader
										size={28}
										strokeWidth={2.5}
										className="text-foreground/60"
									/>
								</div>
							}
						>
							{children}
						</Suspense>
					</div>
				</section>
			</main>
		</div>
	);
}
