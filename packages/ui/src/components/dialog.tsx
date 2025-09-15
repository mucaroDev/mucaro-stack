import { cn } from "@workspace/ui/lib/utils";
import { X } from "lucide-react";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { Button } from "./button";

export type DialogProps = {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	className?: string;
};

const Dialog = ({ open, onClose, children, className }: DialogProps) => {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>
			
			{/* Dialog */}
			<div
				className={cn(
					"relative z-10 mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border bg-background p-0 shadow-lg",
					className
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
};
Dialog.displayName = "Dialog";

const DialogHeader = forwardRef<
	HTMLDivElement,
	ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex items-center justify-between p-6 pb-2", className)}
		{...props}
	/>
));
DialogHeader.displayName = "DialogHeader";

const DialogTitle = forwardRef<
	HTMLHeadingElement,
	ComponentProps<"h2">
>(({ className, ...props }, ref) => (
	<h2
		ref={ref}
		className={cn("text-lg font-semibold leading-none tracking-tight", className)}
		{...props}
	/>
));
DialogTitle.displayName = "DialogTitle";

const DialogClose = forwardRef<
	HTMLButtonElement,
	ComponentProps<typeof Button> & { onClose: () => void }
>(({ onClose, className, ...props }, ref) => (
	<Button
		ref={ref}
		variant="ghost"
		size="icon"
		className={cn("h-6 w-6 rounded-full", className)}
		onClick={onClose}
		{...props}
	>
		<X className="h-4 w-4" />
		<span className="sr-only">Close</span>
	</Button>
));
DialogClose.displayName = "DialogClose";

const DialogContent = forwardRef<
	HTMLDivElement,
	ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("px-6 pb-2", className)}
		{...props}
	/>
));
DialogContent.displayName = "DialogContent";

const DialogFooter = forwardRef<
	HTMLDivElement,
	ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex justify-end gap-2 p-6 pt-4", className)}
		{...props}
	/>
));
DialogFooter.displayName = "DialogFooter";

export {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogContent,
	DialogFooter,
};
