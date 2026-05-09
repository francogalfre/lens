import Image from "next/image";
import Link from "next/link";

export function Logo() {
	return (
		<Link
			href="/"
			className="flex items-center gap-2.5 transition-opacity hover:opacity-75"
			aria-label="Lens — Home"
		>
			<Image
				src="/lens-white.png"
				alt="Lens"
				width={22}
				height={22}
				className="shrink-0"
			/>
			<span className="font-semibold text-foreground text-sm tracking-tight">
				Lens
			</span>
		</Link>
	);
}
