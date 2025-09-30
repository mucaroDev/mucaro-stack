"use client";

import { Button } from "@workspace/ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { AuthNav } from "./auth-nav";
import { ThemeToggle } from "./theme-toggle";

export function MobileMenu() {
	return (
		<div className="md:hidden">
			<Sheet>
				<SheetTrigger asChild>
					<Button aria-label="Toggle menu" size="icon" variant="ghost">
						<Menu className="h-4 w-4" />
					</Button>
				</SheetTrigger>
				<SheetContent className="w-[300px]" side="right">
					<div className="flex flex-col space-y-6 pt-6">
						<nav className="flex flex-col space-y-4">
							<Button asChild className="justify-start" variant="ghost">
								<Link href="/">Home</Link>
							</Button>
							<Button asChild className="justify-start" variant="ghost">
								<Link href="/dashboard">Dashboard</Link>
							</Button>
						</nav>
						<div className="flex items-center justify-between border-t pt-4">
							<ThemeToggle />
							<AuthNav />
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
