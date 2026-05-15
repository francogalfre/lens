"use client";

import { useEffect, useState } from "react";

export const AnimatedScore = ({
	value,
	animate,
}: {
	value: number;
	animate: boolean;
}) => {
	const [displayValue, setDisplayValue] = useState(animate ? 0 : value);

	useEffect(() => {
		if (!animate) {
			setDisplayValue(value);
			return;
		}
		const start = performance.now();
		const duration = 700;
		let frameId = 0;
		const tick = (now: number) => {
			const progress = Math.min(1, (now - start) / duration);
			const eased = 1 - (1 - progress) ** 3;
			setDisplayValue(Math.round(value * eased * 10) / 10);
			if (progress < 1) frameId = requestAnimationFrame(tick);
		};
		frameId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frameId);
	}, [value, animate]);

	return <>{displayValue}</>;
};
