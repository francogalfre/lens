"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { AuthSubmitButton } from "../components/auth-submit-button";
import { PasswordField } from "../components/password-field";
import { ServerErrorBanner } from "../components/server-error-banner";
import { TextField } from "../components/text-field";
import { humanizeResetPasswordError } from "../utils/humanize-errors";

const resetPasswordSchema = z.object({
	otp: z
		.string()
		.length(6, "Code must be 6 digits")
		.regex(/^\d+$/, "Code must be numeric"),
	password: z
		.string()
		.min(8, "Must be at least 8 characters")
		.regex(/[A-Z]/, "Must contain at least one uppercase letter")
		.regex(/[0-9]/, "Must contain at least one number"),
});

const ResetPasswordPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email") ?? "";
	const [serverError, setServerError] = useState<string | null>(null);

	const mutation = useMutation({
		mutationFn: async ({
			otp,
			password,
		}: {
			otp: string;
			password: string;
		}) => {
			const { error } = await authClient.emailOtp.resetPassword({
				email,
				otp,
				password,
			});
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			router.push("/login" as never);
		},
		onError: (error: unknown) => {
			const message =
				error instanceof Error ? error.message : "Something went wrong";
			setServerError(humanizeResetPasswordError(message));
		},
	});

	const form = useForm({
		defaultValues: { otp: "", password: "" },
		validators: { onSubmit: resetPasswordSchema },
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
					Reset password
				</h1>
				<p className="mt-1.5 text-foreground/55 text-sm">
					Enter the 6-digit code we sent to{" "}
					<span className="text-foreground">{email}</span>.
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
				<form.Field name="otp">
					{(field) => (
						<TextField
							id="otp"
							label="Reset code"
							placeholder="123456"
							autoComplete="one-time-code"
							field={field}
						/>
					)}
				</form.Field>

				<form.Field name="password">
					{(field) => (
						<PasswordField
							placeholder="New password (8+ characters)"
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
							loadingLabel="Resetting password…"
							idleLabel="Reset password"
						/>
					)}
				</form.Subscribe>
			</form>

			<p className="mt-6 text-foreground/55 text-sm">
				Didn't receive the code?{" "}
				<Link
					href={"/forgot-password" as never}
					className="text-foreground underline-offset-4 transition-colors hover:underline"
				>
					Try again
				</Link>
			</p>
		</motion.div>
	);
};

export default ResetPasswordPage;
