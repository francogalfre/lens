import { Input } from "@lens/ui/components/input";
import { Label } from "@lens/ui/components/label";

import { formatZodError } from "../utils/form-helpers";

type FieldState = {
	state: { value: string; meta: { errors: unknown[] } };
	handleBlur: () => void;
	handleChange: (value: string) => void;
};

export const TextField = ({
	id,
	label,
	type = "text",
	placeholder,
	autoComplete,
	field,
}: {
	id: string;
	label: string;
	type?: string;
	placeholder: string;
	autoComplete?: string;
	field: FieldState;
}) => (
	<div className="space-y-1.5">
		<Label htmlFor={id} className="text-[11px] text-foreground/55">
			{label}
		</Label>
		<Input
			id={id}
			type={type}
			placeholder={placeholder}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={(event) => field.handleChange(event.target.value)}
			autoComplete={autoComplete}
			className="h-11 rounded-xl border-border bg-card/40 px-3.5 text-foreground placeholder:text-foreground/30 focus-visible:border-foreground/25 focus-visible:ring-0"
		/>
		{field.state.meta.errors.map((error) => (
			<p key={String(error)} className="text-destructive text-xs">
				{formatZodError(error)}
			</p>
		))}
	</div>
);
