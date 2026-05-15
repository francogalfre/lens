const CONFETTI_COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#3b82f6",
	"#8b5cf6",
];

const PIECE_COUNT = 80;

export const Confetti = () => {
	const pieces = Array.from({ length: PIECE_COUNT }, (_, index) => index);
	return (
		<>
			<style>{`
				@keyframes lensConfettiFall {
					0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
					100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
				}
			`}</style>
			<div
				aria-hidden
				className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
			>
				{pieces.map((index) => (
					<span
						key={index}
						className="absolute h-3 w-1.5 rounded-sm"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${-20 + Math.random() * 10}%`,
							backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
							transform: `rotate(${Math.random() * 360}deg)`,
							animation: `lensConfettiFall ${2.4 + Math.random() * 2.4}s ${Math.random() * 1.8}s linear forwards`,
						}}
					/>
				))}
			</div>
		</>
	);
};
