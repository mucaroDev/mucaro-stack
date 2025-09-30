import type { ReactNode } from "react";
import { cn } from "../lib/utils";

type ContainerProps = {
	children: ReactNode;
	className?: string;
};

function Container({ children, className }: ContainerProps) {
	return (
		<div
			className={cn("mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8", className)}
		>
			{children}
		</div>
	);
}

export { Container };
