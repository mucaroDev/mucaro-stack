import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
	{
		variants: {
			variant: {
				default: "text-foreground",
				error: "text-destructive",
				muted: "text-muted-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

export type LabelProps = ComponentProps<"label"> &
	VariantProps<typeof labelVariants> & {
		required?: boolean;
	};

const Label = forwardRef<HTMLLabelElement, LabelProps>(
	({ className, variant, required, children, ...props }, ref) => {
		return (
			<label
				ref={ref}
				className={cn(labelVariants({ variant, className }))}
				{...props}
			>
				{children}
				{required && <span className="ml-1 text-destructive">*</span>}
			</label>
		);
	}
);
Label.displayName = "Label";

export { Label, labelVariants };
