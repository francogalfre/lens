"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { AuthSubmitButton } from "../components/auth-submit-button";
import { ServerErrorBanner } from "../components/server-error-banner";
import { TextField } from "../components/text-field";
import { humanizeForgotPasswordError } from "../utils/humanize-errors";

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email"),
});

const ForgotPasswordPage = () => {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const mutation = useMutation({
		mutationFn: async (email: string) => {
			const { error } = await authClient.emailOtp.requestPasswordReset({
				email,
			});
			if (error) throw new Error(error.message);
		},
		onSuccess: (_, email) => {
			router.push(
				`/reset-password?email=${encodeURIComponent(email)}` as never,
			);
		},
		onError: (error: unknown) => {
			const message =
				error instanceof Error ? error.message : "Something went wrong";
			setServerError(humanizeForgotPasswordError(message));
		},
	});

	const form = useForm({
		defaultValues: { email: "" },
		validators: { onSubmit: forgotPasswordSchema },
		onSubmit: ({ value }) => {
			setServerError(null);
			mutation.mutate(value.email);
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
					Forgot password?
				</h1>
				<p className="mt-1.5 text-foreground/55 text-sm">
					Enter your email and we'll send you a reset code.
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
							loadingLabel="Sending code…"
							idleLabel="Send reset code"
						/>
					)}
				</form.Subscribe>
			</form>

			<p className="mt-6 text-foreground/55 text-sm">
				Remembered it?{" "}
				<Link
					href={"/login" as never}
					className="text-foreground underline-offset-4 transition-colors hover:underline"
				>
					Sign in
				</Link>
			</p>
		</motion.div>
	);
};

export default ForgotPasswordPage;
