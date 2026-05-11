import type { Context } from "hono";
import { rateLimiter } from "hono-rate-limiter";

function ipKey(c: Context): string {
	return (
		c.req.header("x-forwarded-for") ??
		c.req.header("cf-connecting-ip") ??
		"unknown"
	);
}

export const authRateLimit = rateLimiter({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	keyGenerator: ipKey,
});

export const analysisRateLimit = rateLimiter({
	windowMs: 10 * 60 * 1000,
	limit: 5,
	keyGenerator: ipKey,
});
