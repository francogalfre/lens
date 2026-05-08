"use client";

import { Button } from "@lens/ui/components/button";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { trpc } from "@/utils/trpc";
import { FormField } from "../components/form-field";

const schema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/";

	const { mutateAsync: signIn } = useMutation(
		trpc.auth.signIn.mutationOptions(),
	);

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			try {
				await signIn(value);
				toast.success("Welcome back!");
				// Hard redirect so Better Auth's session atom reinitializes from scratch.
				// router.push() does a client-side nav that leaves the cached null session in place.
				window.location.href = callbackUrl;
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Sign in failed");
			}
		},
	});

	return (
		<div className="w-full max-w-md space-y-6">
			<div className="text-center">
				<h1 className="font-bold text-3xl">Welcome back</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Sign in to analyze your ideas
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
							{isSubmitting ? "Signing in..." : "Sign in"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<p className="text-center text-muted-foreground text-sm">
				No account?{" "}
				<Link
					href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
					className="text-foreground underline underline-offset-4"
				>
					Create one
				</Link>
			</p>
		</div>
	);
}
