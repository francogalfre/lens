"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { trpc } from "@/lib/trpc";
import { AuthSubmitButton } from "../components/auth-submit-button";
import { PasswordField } from "../components/password-field";
import { ServerErrorBanner } from "../components/server-error-banner";
import { TextField } from "../components/text-field";
import { safeCallback } from "../utils/form-helpers";
import { humanizeRegisterError } from "../utils/humanize-errors";

const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const RegisterPage = () => {
	const searchParams = useSearchParams();
	const callbackUrl = safeCallback(searchParams.get("callbackUrl"));
	const [serverError, setServerError] = useState<string | null>(null);

	const mutation = useMutation(
		trpc.auth.signUp.mutationOptions({
			onSuccess: () => {
				setServerError(null);
				window.location.href = callbackUrl;
			},
			onError: (error: unknown) => {
				const message =
					error instanceof Error ? error.message : "Sign up failed";
				setServerError(humanizeRegisterError(message));
			},
		}),
	);

	const form = useForm({
		defaultValues: { name: "", email: "", password: "" },
		validators: { onSubmit: registerSchema },
		onSubmit: ({ value }) => {
			setServerError(null);
			mutation.mutate(value);
		},
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
		>
			<div className="mb-8">
				<h1 className="font-medium text-3xl text-foreground leading-tight tracking-tight">
					Create account
				</h1>
				<p className="mt-1.5 text-foreground/55 text-sm">
					Start putting your ideas under the lens.
				</p>
			</div>

			<ServerErrorBanner message={serverError} />

			<form
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.Field name="name">
					{(field) => (
						<TextField
							id="name"
							label="Full name"
							placeholder="Your name"
							autoComplete="name"
							field={field}
						/>
					)}
				</form.Field>

				<form.Field name="email">
					{(field) => (
						<TextField
							id="email"
							label="Email"
							type="email"
							placeholder="you@example.com"
							autoComplete="email"
							field={field}
						/>
					)}
				</form.Field>

				<form.Field name="password">
					{(field) => (
						<PasswordField
							placeholder="8+ characters"
							autoComplete="new-password"
							field={field}
						/>
					)}
				</form.Field>

				<form.Subscribe
					selector={(state) => ({
						canSubmit: state.canSubmit,
						isSubmitting: state.isSubmitting,
					})}
				>
					{({ canSubmit, isSubmitting }) => (
						<AuthSubmitButton
							isDisabled={!canSubmit || isSubmitting || mutation.isPending}
							isLoading={isSubmitting || mutation.isPending}
							loadingLabel="Creating account…"
							idleLabel="Create account"
						/>
					)}
				</form.Subscribe>
			</form>

			<p className="mt-6 text-foreground/55 text-sm">
				Already have an account?{" "}
				<Link
					href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
					className="text-foreground underline-offset-4 transition-colors hover:underline"
				>
					Sign in
				</Link>
			</p>
		</motion.div>
	);
};

export default RegisterPage;
