import { TRPCError } from "@trpc/server";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, { count: number; resetAt: number }>();

function getIp(headers: Headers): string {
	return (
		headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
		headers.get("cf-connecting-ip") ??
		"unknown"
	);
}

export function checkLoginRateLimit(headers: Headers): void {
	const ip = getIp(headers);

	const now = Date.now();
	const entry = attempts.get(ip);

	if (!entry || now > entry.resetAt) {
		attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
		return;
	}

	entry.count++;

	if (entry.count > MAX_ATTEMPTS) {
		throw new TRPCError({
			code: "TOO_MANY_REQUESTS",
			message: "Too many login attempts. Please try again in 15 minutes.",
		});
	}
}
