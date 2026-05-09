"use client";

import { Button } from "@lens/ui/components/button";
import { Input } from "@lens/ui/components/input";
import { Label } from "@lens/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { trpc } from "@/utils/trpc";

const schema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/";
	const [showPassword, setShowPassword] = useState(false);

	const { mutateAsync: signIn } = useMutation(
		trpc.auth.signIn.mutationOptions(),
	);

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			try {
				await signIn(value);
				window.location.href = callbackUrl;
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Sign in failed");
			}
		},
	});

	return (
		<div className="w-full max-w-sm">
			{/* Logo */}
			<Link
				href="/"
				className="mb-10 inline-flex items-center gap-2 text-foreground/80 transition-opacity hover:opacity-70"
			>
				<div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground">
					<div className="h-2.5 w-2.5 rounded-sm bg-background" />
				</div>
				<span className="font-semibold tracking-tight">Lens</span>
			</Link>

			{/* Heading */}
			<div className="mb-8">
				<h1 className="font-semibold text-2xl tracking-tight">Welcome back</h1>
				<p className="mt-1.5 text-muted-foreground text-sm">
					Sign in to your account to continue
				</p>
			</div>

			{/* Form */}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.Field name="email">
					{(field) => (
						<div className="space-y-1.5">
							<Label htmlFor="email" className="text-muted-foreground text-xs">
								Email address
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								autoComplete="email"
								className="h-10 rounded-xl border-white/10 bg-white/[0.04] placeholder:text-muted-foreground/40 focus-visible:border-white/20 focus-visible:ring-0"
							/>
							{field.state.meta.errors.map((err) => (
								<p key={String(err)} className="text-destructive text-xs">
									{String(err)}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="password">
					{(field) => (
						<div className="space-y-1.5">
							<Label
								htmlFor="password"
								className="text-muted-foreground text-xs"
							>
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									autoComplete="current-password"
									className="h-10 rounded-xl border-white/10 bg-white/[0.04] pr-10 placeholder:text-muted-foreground/40 focus-visible:border-white/20 focus-visible:ring-0"
								/>
								<button
									type="button"
									tabIndex={-1}
									onClick={() => setShowPassword((v) => !v)}
									className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
							{field.state.meta.errors.map((err) => (
								<p key={String(err)} className="text-destructive text-xs">
									{String(err)}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Subscribe
					selector={(s) => ({
						canSubmit: s.canSubmit,
						isSubmitting: s.isSubmitting,
					})}
				>
					{({ canSubmit, isSubmitting }) => (
						<Button
							type="submit"
							className="mt-1 h-10 w-full rounded-xl font-medium"
							disabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in…
								</>
							) : (
								"Continue"
							)}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<p className="mt-6 text-muted-foreground text-sm">
				No account?{" "}
				<Link
					href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
					className="text-foreground/80 underline underline-offset-4 transition-opacity hover:opacity-70"
				>
					Create one
				</Link>
			</p>
		</div>
	);
}
