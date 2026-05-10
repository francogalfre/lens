import { z } from "zod";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const signUpSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(100),
	email: z.string().regex(EMAIL_REGEX, "Invalid email"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(72, "Password must be under 72 characters"),
});

export const signInSchema = z.object({
	email: z.string().regex(EMAIL_REGEX, "Invalid email"),
	password: z.string().min(1, "Password is required").max(72),
});
