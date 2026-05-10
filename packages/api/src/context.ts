import { auth } from "@lens/auth";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
	const requestHeaders = context.req.raw.headers;
	const session = await auth.api.getSession({ headers: requestHeaders });

	return {
		session,
		requestHeaders,
		responseHeaders: new Headers(),
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
