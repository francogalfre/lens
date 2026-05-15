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
import { humanizeLoginError } from "../utils/humanize-errors";

const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
	const searchParams = useSearchParams();
	const callbackUrl = safeCallback(searchParams.get("callbackUrl"));
	const [serverError, setServerError] = useState<string | null>(null);

	const mutation = useMutation(
		trpc.auth.signIn.mutationOptions({
			onSuccess: () => {
				setServerError(null);
				window.location.href = callbackUrl;
			},
			onError: (error: unknown) => {
				const message =
					error instanceof Error ? error.message : "Sign in failed";
				setServerError(humanizeLoginError(message));
			},
		}),
	);

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onSubmit: loginSchema },
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
					Welcome back
				</h1>
				<p className="mt-1.5 text-foreground/55 text-sm">
					Sign in to continue.
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
							placeholder="••••••••"
							autoComplete="current-password"
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
							loadingLabel="Signing in…"
							idleLabel="Continue"
						/>
					)}
				</form.Subscribe>
			</form>

			<p className="mt-6 text-foreground/55 text-sm">
				No account?{" "}
				<Link
					href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
					className="text-foreground underline-offset-4 transition-colors hover:underline"
				>
					Create one
				</Link>
			</p>
		</motion.div>
	);
};

export default LoginPage;
