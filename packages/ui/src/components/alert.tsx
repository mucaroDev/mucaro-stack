import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";

const alertVariants = cva(
	"relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground border-border",
				destructive:
					"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10",
				success:
					"border-green-500/50 text-green-700 dark:border-green-500 [&>svg]:text-green-700 bg-green-50 dark:bg-green-950/20",
				warning:
					"border-yellow-500/50 text-yellow-700 dark:border-yellow-500 [&>svg]:text-yellow-700 bg-yellow-50 dark:bg-yellow-950/20",
				info:
					"border-blue-500/50 text-blue-700 dark:border-blue-500 [&>svg]:text-blue-700 bg-blue-50 dark:bg-blue-950/20",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

export type AlertProps = ComponentProps<"div"> &
	VariantProps<typeof alertVariants>;

const Alert = forwardRef<HTMLDivElement, AlertProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	)
);
Alert.displayName = "Alert";

const AlertTitle = forwardRef<
	HTMLHeadingElement,
	ComponentProps<"h5">
>(({ className, ...props }, ref) => (
	<h5
		ref={ref}
		className={cn("mb-1 font-medium leading-none tracking-tight", className)}
		{...props}
	/>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef<
	HTMLParagraphElement,
	ComponentProps<"p">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("text-sm [&_p]:leading-relaxed", className)}
		{...props}
	/>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
