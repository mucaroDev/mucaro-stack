import { cn } from "@workspace/ui/lib/utils";
import { forwardRef, type ComponentProps } from "react";
import { Input, type InputProps } from "./input";
import { Label, type LabelProps } from "./label";

export type FormFieldProps = {
	label: string;
	error?: string;
	required?: boolean;
	className?: string;
	labelProps?: Omit<LabelProps, "htmlFor" | "required" | "children">;
	inputProps?: Omit<InputProps, "id">;
} & Pick<ComponentProps<"div">, "id">;

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
	({ label, error, required, className, labelProps, inputProps, id, ...props }, ref) => {
		const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

		return (
			<div className={cn("space-y-2", className)} {...props}>
				<Label htmlFor={fieldId} required={required} {...labelProps}>
					{label}
				</Label>
				<Input
					ref={ref}
					id={fieldId}
					error={!!error}
					{...inputProps}
				/>
				{error && (
					<p className="text-sm text-destructive">{error}</p>
				)}
			</div>
		);
	}
);
FormField.displayName = "FormField";

export { FormField };
