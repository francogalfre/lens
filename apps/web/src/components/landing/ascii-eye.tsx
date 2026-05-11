"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const EYE_FRAMES = [
	`    .' .-. '.    .' .-. '.
   (  ( o )  )  (  ( o )  )
    \`._\`-'_.='    \`._\`-'_.='`,
	`    ,' .-. ',    ,' .-. '.
   (  ( o )  )  (  ( o )  )
    \`._\`-'_.='    \`._\`-'_.='`,
	`    .' .-. '.    .' .-. '.
   (  ( o )  )  (  ( o )  )
    \`._\`-'_.='    \`._\`-'_.='`,
];

export function AsciiEye() {
	const [frame, setFrame] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setFrame((prev) => (prev + 1) % EYE_FRAMES.length);
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	return (
		<motion.div
			className="select-none font-mono text-foreground/50 text-xs leading-[1.2] sm:text-sm"
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
			key={frame}
		>
			<pre className="whitespace-pre">{EYE_FRAMES[frame]}</pre>
		</motion.div>
	);
}
