import { Input } from "@lens/ui/components/input";
import { Label } from "@lens/ui/components/label";
import type { AnyFieldApi } from "@tanstack/react-form";

type FormFieldProps = {
	field: AnyFieldApi;
	label: string;
	type?: "text" | "email" | "password";
};

export function FormField({ field, label, type = "text" }: FormFieldProps) {
	return (
		<div className="space-y-1">
			<Label htmlFor={field.name}>{label}</Label>
			<Input
				id={field.name}
				name={field.name}
				type={type}
				value={field.state.value as string}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{field.state.meta.errors.map((error) => (
				<p key={String(error)} className="text-destructive text-xs">
					{String(error)}
				</p>
			))}
		</div>
	);
}
