import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";

const inputVariants = cva(
	"flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "border-border",
				error: "border-destructive focus-visible:ring-destructive",
			},
			size: {
				default: "h-9",
				sm: "h-8 px-2.5 text-xs",
				lg: "h-10 px-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export type InputProps = ComponentProps<"input"> &
	VariantProps<typeof inputVariants> & {
		error?: boolean;
	};

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, variant, size, error, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					inputVariants({ 
						variant: error ? "error" : variant, 
						size, 
						className 
					})
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input, inputVariants };
