"use client";

import { Button } from "@workspace/ui/components";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button className="h-9 w-9" size="icon" variant="ghost">
				<div className="h-4 w-4" />
			</Button>
		);
	}

	return (
		<Button
			aria-label="Toggle theme"
			className="h-9 w-9"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			size="icon"
			variant="ghost"
		>
			<Sun className="dark:-rotate-90 h-4 w-4 rotate-0 scale-100 transition-all dark:scale-0" />
			<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		</Button>
	);
}
