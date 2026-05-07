import { auth } from "@lens/auth";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../index";

const signUpSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(1, "Password is required"),
});

function forwardAuthHeaders(from: Response, to: Headers): void {
	// Set-Cookie cannot be forwarded via forEach — the Headers API joins multiple
	// Set-Cookie values with commas, which corrupts cookie attributes like expires.
	// getSetCookie() returns each cookie as a separate, untouched string.
	for (const cookie of from.headers.getSetCookie()) {
		to.append("set-cookie", cookie);
	}
	from.headers.forEach((value, key) => {
		if (key.toLowerCase() !== "set-cookie") {
			to.append(key, value);
		}
	});
}

async function parseAuthError(response: Response): Promise<string> {
	try {
		const data = (await response.json()) as { message?: string };
		return data.message ?? "Authentication failed";
	} catch {
		return "Authentication failed";
	}
}

export const authRouter = router({
	signUp: publicProcedure
		.input(signUpSchema)
		.mutation(async ({ input, ctx }) => {
			const response = await auth.api.signUpEmail({
				body: input,
				asResponse: true,
			});

			forwardAuthHeaders(response, ctx.responseHeaders);

			if (!response.ok) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: await parseAuthError(response),
				});
			}

			return response.json();
		}),

	signIn: publicProcedure
		.input(signInSchema)
		.mutation(async ({ input, ctx }) => {
			const response = await auth.api.signInEmail({
				body: input,
				asResponse: true,
			});

			forwardAuthHeaders(response, ctx.responseHeaders);

			if (!response.ok) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: await parseAuthError(response),
				});
			}

			return response.json();
		}),

	signOut: protectedProcedure.mutation(async ({ ctx }) => {
		const response = await auth.api.signOut({
			headers: ctx.requestHeaders,
			asResponse: true,
		});

		forwardAuthHeaders(response, ctx.responseHeaders);

		return { success: true };
	}),
});
