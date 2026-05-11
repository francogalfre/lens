import { auth } from "@lens/auth";
import type { Context as HonoContext } from "hono";

export function authHandler(c: HonoContext): Promise<Response> {
	return auth.handler(c.req.raw);
}
