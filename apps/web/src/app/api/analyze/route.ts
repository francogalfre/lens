import { type NextRequest, NextResponse } from "next/server";

const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
	const body = (await req.json()) as { rawIdea?: string };

	if (!body.rawIdea?.trim()) {
		return NextResponse.json({ error: "rawIdea is required" }, { status: 400 });
	}

	const upstream = await fetch(`${SERVER_URL}/api/analysis/stream`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			cookie: req.headers.get("cookie") ?? "",
		},
		body: JSON.stringify({ rawIdea: body.rawIdea }),
	});

	if (upstream.status === 401) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (!upstream.ok || !upstream.body) {
		return NextResponse.json({ error: "Upstream error" }, { status: 502 });
	}

	return new NextResponse(upstream.body, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			"X-Accel-Buffering": "no",
		},
	});
}
