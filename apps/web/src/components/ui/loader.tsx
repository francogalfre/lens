import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface LoaderProps {
	size?: number;
	strokeWidth?: number;
	className?: string;
}

export default function Loader({
	size = 24,
	strokeWidth = 2,
	className = "",
}: LoaderProps) {
	return (
		<ArrowPathIcon
			className={`animate-spin ${className}`}
			style={{ width: size, height: size, strokeWidth }}
		/>
	);
}
