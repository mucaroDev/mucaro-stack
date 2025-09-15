import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";
import { forwardRef, type ComponentProps, useState, useEffect } from "react";

export type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
	label?: string;
	error?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, label, error, id, checked, onChange, ...props }, ref) => {
		const [isChecked, setIsChecked] = useState(checked || false);
		const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

		useEffect(() => {
			setIsChecked(checked || false);
		}, [checked]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setIsChecked(e.target.checked);
			onChange?.(e);
		};

		return (
			<div className="flex items-center space-x-2">
				<div className="relative">
					<input
						type="checkbox"
						ref={ref}
						id={checkboxId}
						checked={isChecked}
						onChange={handleChange}
						className="sr-only peer"
						{...props}
					/>
					<div
						className={cn(
							"flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary ring-offset-background transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
							isChecked && "bg-primary text-primary-foreground",
							error && "border-destructive peer-focus-visible:ring-destructive",
							className
						)}
					>
						<Check
							className={cn(
								"h-3 w-3 transition-opacity",
								isChecked ? "opacity-100" : "opacity-0"
							)}
						/>
					</div>
				</div>
				{label && (
					<label
						htmlFor={checkboxId}
						className={cn(
							"text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
							error && "text-destructive"
						)}
					>
						{label}
					</label>
				)}
			</div>
		);
	}
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
