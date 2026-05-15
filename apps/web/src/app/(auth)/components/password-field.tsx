"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Input } from "@lens/ui/components/input";
import { Label } from "@lens/ui/components/label";
import { useState } from "react";

import { formatZodError } from "../utils/form-helpers";

type FieldState = {
	state: { value: string; meta: { errors: unknown[] } };
	handleBlur: () => void;
	handleChange: (value: string) => void;
};

export const PasswordField = ({
	placeholder,
	autoComplete,
	field,
}: {
	placeholder: string;
	autoComplete: string;
	field: FieldState;
}) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div className="space-y-1.5">
			<Label htmlFor="password" className="text-[11px] text-foreground/55">
				Password
			</Label>
			<div className="relative">
				<Input
					id="password"
					type={isVisible ? "text" : "password"}
					placeholder={placeholder}
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={(event) => field.handleChange(event.target.value)}
					autoComplete={autoComplete}
					className="h-11 rounded-xl border-border bg-card/40 px-3.5 pr-10 text-foreground placeholder:text-foreground/30 focus-visible:border-foreground/25 focus-visible:ring-0"
				/>
				<button
					type="button"
					tabIndex={-1}
					onClick={() => setIsVisible((current) => !current)}
					className="absolute top-1/2 right-3 -translate-y-1/2 text-foreground/40 transition-colors hover:text-foreground"
					aria-label={isVisible ? "Hide password" : "Show password"}
				>
					{isVisible ? (
						<EyeSlashIcon className="h-4 w-4" />
					) : (
						<EyeIcon className="h-4 w-4" />
					)}
				</button>
			</div>
			{field.state.meta.errors.map((error) => (
				<p key={String(error)} className="text-destructive text-xs">
					{formatZodError(error)}
				</p>
			))}
		</div>
	);
};
