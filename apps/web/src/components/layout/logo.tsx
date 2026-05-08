import Image from "next/image";
import Link from "next/link";

import blackLogo from "@/assets/icon/lens-accent-black.png";
import whiteLogo from "@/assets/icon/lens-accent-white.png";

export function Logo() {
	return (
		<Link
			href="/"
			className="flex items-center gap-2 transition-opacity hover:opacity-80"
			aria-label="Lens - Home"
		>
			<div className="relative h-8 w-8 overflow-hidden rounded-lg">
				<Image
					src={whiteLogo}
					alt="Lens"
					fill
					className="object-cover dark:hidden"
					sizes="32px"
				/>
				<Image
					src={blackLogo}
					alt="Lens"
					fill
					className="hidden object-cover dark:block"
					sizes="32px"
				/>
			</div>
			<span className="font-bold text-xl">Lens</span>
		</Link>
	);
}
