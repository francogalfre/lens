import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		POLAR_ACCESS_TOKEN: z.string().min(1),
		POLAR_WEBHOOK_SECRET: z.string().min(1),
		POLAR_PRODUCT_ID: z.string().min(1),
		POLAR_ENV: z.enum(["sandbox", "production"]).default("production"),
		OPENROUTER_API_KEY: z.string().min(1),
		OPENROUTER_MODEL: z.string().min(1).default("openai/gpt-oss-120b:free"),
		RESEND_API_KEY: z.string().min(1),
		RESEND_FROM_EMAIL: z.string().min(1),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
