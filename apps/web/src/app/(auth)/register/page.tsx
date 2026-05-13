"use client";

import {
	ArrowPathIcon,
	ExclamationTriangleIcon,
	EyeIcon,
	EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@lens/ui/components/input";
import { Label } from "@lens/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { trpc } from "@/lib/trpc";

const schema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

function safeCallback(path: string | null): string {
	if (!path) return "/";
	if (!path.startsWith("/") || path.startsWith("//")) return "/";
	return path;
}

function formatZodError(err: unknown): string {
	if (typeof err === "string") return err;
	if (err && typeof err === "object" && "message" in err) {
		return String((err as { message: unknown }).message);
	}
	return "Invalid input";
}

function humanizeError(message: string): string {
	const m = message.toLowerCase();
	if (m.includes("user_already_exists") || m.includes("already exists"))
		return "An account with this email already exists. Try signing in instead.";
	if (m.includes("password") && m.includes("short"))
		return "That password is too short. Use 8 or more characters.";
	if (m.includes("invalid") && m.includes("email"))
		return "That email address doesn't look right.";
	return message;
}

export default function RegisterPage() {
	const searchParams = useSearchParams();
	const callbackUrl = safeCallback(searchParams.get("callbackUrl"));
	const [showPassword, setShowPassword] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const mutation = useMutation(
		trpc.auth.signUp.mutationOptions({
			onSuccess: () => {
				setServerError(null);
				window.location.href = callbackUrl;
			},
			onError: (error: unknown) => {
				const raw = error instanceof Error ? error.message : "Sign up failed";
				setServerError(humanizeError(raw));
			},
		}),
	);

	const form = useForm({
		defaultValues: { name: "", email: "", password: "" },
		validators: { onSubmit: schema },
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

			<AnimatePresence>
				{serverError && (
					<motion.div
						key={serverError}
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{ duration: 0.2 }}
						role="alert"
						className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/[0.06] px-3.5 py-2.5"
					>
						<ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
						<p className="text-destructive text-sm leading-snug">
							{serverError}
						</p>
					</motion.div>
				)}
			</AnimatePresence>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.Field name="name">
					{(field) => (
						<div className="space-y-1.5">
							<Label htmlFor="name" className="text-[11px] text-foreground/55">
								Full name
							</Label>
							<Input
								id="name"
								type="text"
								placeholder="Your name"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								autoComplete="name"
								className="h-11 rounded-xl border-border bg-card/40 px-3.5 text-foreground placeholder:text-foreground/30 focus-visible:border-foreground/25 focus-visible:ring-0"
							/>
							{field.state.meta.errors.map((err) => (
								<p key={String(err)} className="text-destructive text-xs">
									{formatZodError(err)}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="email">
					{(field) => (
						<div className="space-y-1.5">
							<Label htmlFor="email" className="text-[11px] text-foreground/55">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								autoComplete="email"
								className="h-11 rounded-xl border-border bg-card/40 px-3.5 text-foreground placeholder:text-foreground/30 focus-visible:border-foreground/25 focus-visible:ring-0"
							/>
							{field.state.meta.errors.map((err) => (
								<p key={String(err)} className="text-destructive text-xs">
									{formatZodError(err)}
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
								className="text-[11px] text-foreground/55"
							>
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="8+ characters"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									autoComplete="new-password"
									className="h-11 rounded-xl border-border bg-card/40 px-3.5 pr-10 text-foreground placeholder:text-foreground/30 focus-visible:border-foreground/25 focus-visible:ring-0"
								/>
								<button
									type="button"
									tabIndex={-1}
									onClick={() => setShowPassword((v) => !v)}
									className="absolute top-1/2 right-3 -translate-y-1/2 text-foreground/40 transition-colors hover:text-foreground"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? (
										<EyeSlashIcon className="h-4 w-4" />
									) : (
										<EyeIcon className="h-4 w-4" />
									)}
								</button>
							</div>
							{field.state.meta.errors.map((err) => (
								<p key={String(err)} className="text-destructive text-xs">
									{formatZodError(err)}
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
						<button
							type="submit"
							className="mt-2 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-foreground font-medium text-background text-sm transition-all hover:bg-foreground/90 disabled:opacity-60"
							disabled={!canSubmit || isSubmitting || mutation.isPending}
						>
							{isSubmitting || mutation.isPending ? (
								<>
									<ArrowPathIcon className="h-4 w-4 animate-spin" />
									Creating account…
								</>
							) : (
								"Create account"
							)}
						</button>
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
}
