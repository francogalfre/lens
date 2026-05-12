import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lens — AI idea analysis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background:
					"linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
				color: "white",
				fontFamily: "sans-serif",
				padding: 80,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 14,
					marginBottom: 32,
				}}
			>
				<div
					style={{
						width: 36,
						height: 36,
						borderRadius: 999,
						border: "3px solid white",
						display: "flex",
					}}
				/>
				<span style={{ fontSize: 36, fontWeight: 600, letterSpacing: -1 }}>
					Lens
				</span>
			</div>
			<div
				style={{
					fontSize: 84,
					fontWeight: 500,
					letterSpacing: -2,
					textAlign: "center",
					lineHeight: 1.05,
				}}
			>
				See what others don&apos;t
			</div>
			<div
				style={{
					marginTop: 28,
					fontSize: 28,
					opacity: 0.6,
					textAlign: "center",
					maxWidth: 880,
				}}
			>
				Six AI agents stress-test your idea in under a minute.
			</div>
		</div>,
		{ ...size },
	);
}
