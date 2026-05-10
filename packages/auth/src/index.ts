import { createDb } from "@lens/db";
import * as schema from "@lens/db/schema/auth";
import { env } from "@lens/env/server";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export function createAuth() {
	const db = createDb();
	const polarClient = new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		server: env.POLAR_ENV,
	});

	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: schema,
		}),

		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
		},

		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,

		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},

		plugins: [
			polar({
				client: polarClient,
				createCustomerOnSignUp: true,
				use: [
					checkout({
						products: [{ productId: env.POLAR_PRODUCT_ID, slug: "premium" }],
						successUrl: `${env.CORS_ORIGIN}/dashboard?upgraded=true`,
						authenticatedUsersOnly: true,
					}),
					portal(),
				],
			}),
		],
	});
}

export const auth = createAuth();
