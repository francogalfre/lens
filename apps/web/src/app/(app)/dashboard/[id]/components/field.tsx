import { Label } from "./label";

interface FieldProps {
	label: string;
	value?: string;
}

export function Field({ label, value }: FieldProps) {
	if (!value) return null;
	return (
		<div>
			<Label>{label}</Label>
			<p className="mt-0.5 text-sm leading-relaxed">
				{value.charAt(0).toUpperCase() + value.slice(1)}
			</p>
		</div>
	);
}
