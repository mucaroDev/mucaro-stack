import { cn } from "@workspace/ui/lib/utils";
import { type ComponentProps, forwardRef } from "react";
import { Input } from "./input";
import { Label } from "./label";

export type FormFieldProps = {
	label: string;
	error?: string;
	required?: boolean;
	className?: string;
	labelProps?: Omit<ComponentProps<typeof Label>, "htmlFor" | "children">;
	inputProps?: Omit<ComponentProps<"input">, "id">;
} & Pick<ComponentProps<"div">, "id">;

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
	(
		{ label, error, required, className, labelProps, inputProps, id, ...props },
		ref
	) => {
		const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

		return (
			<div className={cn("space-y-2", className)} {...props}>
				<Label htmlFor={fieldId} {...labelProps}>
					{label}
					{required && <span className="text-destructive">*</span>}
				</Label>
				<Input id={fieldId} ref={ref} {...inputProps} />
				{error && <p className="text-destructive text-sm">{error}</p>}
			</div>
		);
	}
);
FormField.displayName = "FormField";

export { FormField };
