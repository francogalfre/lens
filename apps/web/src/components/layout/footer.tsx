import Image from "next/image";
import Link from "next/link";

import lensLogo from "@/assets/lens.svg";

export function Footer() {
	return (
		<footer className="mt-12 border-border/60 border-t">
			<div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
				<div className="flex items-center gap-2.5">
					<Image
						src={lensLogo}
						alt="Lens"
						width={18}
						height={18}
						className="shrink-0 dark:invert"
					/>
					<span className="font-medium text-foreground text-sm tracking-tight">
						Lens
					</span>
					<span className="text-foreground/35 text-xs">
						© {new Date().getFullYear()}
					</span>
				</div>

				<nav className="flex items-center gap-6 text-foreground/55 text-xs">
					<Link href="/" className="transition-colors hover:text-foreground">
						Home
					</Link>
					<Link
						href="/dashboard"
						className="transition-colors hover:text-foreground"
					>
						Dashboard
					</Link>
					<Link
						href="/upgrade"
						className="transition-colors hover:text-foreground"
					>
						Pricing
					</Link>
					<a
						href="mailto:francogalfre.code@gmail.com"
						className="transition-colors hover:text-foreground"
					>
						Contact
					</a>
				</nav>
			</div>
		</footer>
	);
}
