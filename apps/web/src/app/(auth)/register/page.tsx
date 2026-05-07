"use client";

import { Button } from "@lens/ui/components/button";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { FormField } from "@/components/auth/form-field";
import { trpc } from "@/utils/trpc";

const schema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function RegisterPage() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/";

	const { mutateAsync: signUp } = useMutation(
		trpc.auth.signUp.mutationOptions(),
	);

	const form = useForm({
		defaultValues: { name: "", email: "", password: "" },
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			try {
				await signUp(value);
				toast.success("Account created!");
				window.location.href = callbackUrl;
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Sign up failed");
			}
		},
	});

	return (
		<div className="w-full max-w-md space-y-6">
			<div className="text-center">
				<h1 className="font-bold text-3xl">Create account</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Start analyzing your ideas with AI agents
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.Field name="name">
					{(field) => <FormField field={field} label="Name" />}
				</form.Field>

				<form.Field name="email">
					{(field) => <FormField field={field} label="Email" type="email" />}
				</form.Field>

				<form.Field name="password">
					{(field) => (
						<FormField field={field} label="Password" type="password" />
					)}
				</form.Field>

				<form.Subscribe
					selector={(state) => ({
						canSubmit: state.canSubmit,
						isSubmitting: state.isSubmitting,
					})}
				>
					{({ canSubmit, isSubmitting }) => (
						<Button
							type="submit"
							className="w-full"
							disabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "Creating account..." : "Create account"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<p className="text-center text-muted-foreground text-sm">
				Already have an account?{" "}
				<Link
					href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
					className="text-foreground underline underline-offset-4"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
