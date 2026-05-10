import { auth } from "@lens/auth";
import { TRPCError } from "@trpc/server";

import { signInSchema, signUpSchema } from "@/schemas/auth";
import { forwardAuthHeaders, parseAuthError } from "@/services/auth";
import { checkLoginRateLimit } from "@/services/rate-limit";
import { protectedProcedure, publicProcedure, router } from "@/trpc";

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
			checkLoginRateLimit(ctx.requestHeaders);

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
