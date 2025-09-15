import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";

const cardVariants = cva(
	"rounded-lg border bg-card text-card-foreground shadow-sm",
	{
		variants: {
			variant: {
				default: "border-border",
				outline: "border-border bg-background",
				elevated: "border-border shadow-md",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

export type CardProps = ComponentProps<"div"> &
	VariantProps<typeof cardVariants>;

const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(cardVariants({ variant, className }))}
			{...props}
		/>
	)
);
Card.displayName = "Card";

const CardHeader = forwardRef<
	HTMLDivElement,
	ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col space-y-1.5 p-6", className)}
		{...props}
	/>
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
	HTMLHeadingElement,
	ComponentProps<"h3">
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
	HTMLParagraphElement,
	ComponentProps<"p">
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-sm text-muted-foreground", className)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<
	HTMLDivElement,
	ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<
	HTMLDivElement,
	ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex items-center p-6 pt-0", className)}
		{...props}
	/>
));
CardFooter.displayName = "CardFooter";

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
	cardVariants,
};
