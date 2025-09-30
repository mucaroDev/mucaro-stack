"use client";

import { Button } from "@workspace/ui/components";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type ViewTransition = {
	ready: Promise<void>;
};

type DocumentWithViewTransition = Document & {
	startViewTransition(callback: () => void): ViewTransition;
};

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	function onClick(e: React.MouseEvent<HTMLButtonElement>) {
		const x = e.clientX;
		const y = e.clientY;

		const switchTheme = () => setTheme(theme === "dark" ? "light" : "dark");

		// Fallback: no animation
		if (!("startViewTransition" in document)) {
			switchTheme();
			return;
		}

		const vt = (document as DocumentWithViewTransition).startViewTransition(
			() => {
				switchTheme();
			}
		);

		vt.ready.then(() => {
			const endRadius = Math.hypot(
				Math.max(x, window.innerWidth - x),
				Math.max(y, window.innerHeight - y)
			);

			// Animate the reveal on the NEW snapshot
			document.documentElement.animate(
				[
					{ clipPath: `circle(0px at ${x}px ${y}px)` },
					{ clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
				],
				{
					duration: 500,
					easing: "cubic-bezier(.2,.8,.2,1)",
					pseudoElement: "::view-transition-new(root)",
				}
			);
		});
	}

	return (
		<Button
			aria-label="Toggle theme"
			className="h-9 w-9"
			onClick={onClick}
			size="icon"
			variant="ghost"
		>
			<Sun className="dark:-rotate-90 h-4 w-4 rotate-0 scale-100 transition-all dark:scale-0" />
			<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		</Button>
	);
}
