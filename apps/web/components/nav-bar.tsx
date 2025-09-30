"use client";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import Link from "next/link";
import { AuthNav } from "./auth-nav";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

export default function NavBar() {
	return (
		<header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<Container className="flex h-14 items-center">
				{/* Logo */}
				<div className="mr-4 flex">
					<Button asChild className="mr-6 h-auto p-0" variant="ghost">
						<Link className="flex items-center space-x-2" href="/">
							<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
								<span className="font-bold text-sm">M</span>
							</div>
							<span className="hidden font-bold sm:inline-block">
								Mucaro Stack
							</span>
						</Link>
					</Button>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
					<div className="flex items-center space-x-6 font-medium text-sm">
						<Button asChild className="h-auto p-0" variant="link">
							<Link href="/">Home</Link>
						</Button>
						<Button asChild className="h-auto p-0" variant="link">
							<Link href="/dashboard">Dashboard</Link>
						</Button>
					</div>

					<div className="flex items-center space-x-2">
						<ThemeToggle />
						<AuthNav />
					</div>
				</nav>

				{/* Mobile Navigation */}
				<div className="flex flex-1 items-center justify-end md:hidden">
					<MobileMenu />
				</div>
			</Container>
		</header>
	);
}
