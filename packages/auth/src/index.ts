import { createDb } from "@lens/db";
import * as schema from "@lens/db/schema/auth";
import { env } from "@lens/env/server";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

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
			emailOTP({
				async sendVerificationOTP({ email, otp, type }) {
					if (type !== "forget-password") return;

					await resend.emails.send({
						from: env.RESEND_FROM_EMAIL,
						to: email,
						subject: "Reset your Lens password",
						html: `
							<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;">
								<p style="font-size:22px;font-weight:600;margin:0 0 8px;">Reset your password</p>
								<p style="font-size:14px;color:#6b7280;margin:0 0 32px;">Use the code below to reset your Lens password. It expires in 10 minutes.</p>
								<div style="background:#f3f4f6;border-radius:12px;padding:24px;text-align:center;letter-spacing:8px;font-size:32px;font-weight:700;font-family:monospace;">
									${otp}
								</div>
								<p style="font-size:12px;color:#9ca3af;margin:32px 0 0;">If you didn't request this, you can safely ignore this email.</p>
							</div>
						`,
					});
				},
			}),
			polar({
				client: polarClient,
				createCustomerOnSignUp: true,
				use: [
					checkout({
						products: [{ productId: env.POLAR_PRODUCT_ID, slug: "premium" }],
						successUrl: `${env.CORS_ORIGIN}/upgrade/success?checkout_id={CHECKOUT_ID}`,
						authenticatedUsersOnly: true,
					}),
					portal(),
				],
			}),
		],
	});
}

export const auth = createAuth();
