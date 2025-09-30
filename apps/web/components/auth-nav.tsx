"use client";

import { authClient, useSession } from "@workspace/auth/client";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthNav() {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push("/");
		router.refresh();
	};

	if (isPending) {
		return (
			<div className="flex items-center space-x-4">
				<div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
			</div>
		);
	}

	if (!session) {
		return (
			<div className="flex items-center space-x-4">
				<Button asChild variant="ghost">
					<Link href="/auth/sign-in">Sign in</Link>
				</Button>
				<Button asChild>
					<Link href="/auth/sign-up">Sign up</Link>
				</Button>
			</div>
		);
	}

	const user = session.user;
	const initials =
		user.name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase() ||
		user.email?.[0]?.toUpperCase() ||
		"?";

	return (
		<div className="flex items-center space-x-4">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="relative h-8 w-8 rounded-full" variant="ghost">
						<Avatar className="h-8 w-8">
							<AvatarImage
								alt={user.name || user.email}
								src={user.image || undefined}
							/>
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="font-medium text-sm leading-none">{user.name}</p>
							<p className="text-muted-foreground text-xs leading-none">
								{user.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link className="cursor-pointer" href="/dashboard">
							<User className="mr-2 h-4 w-4" />
							<span>Dashboard</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link className="cursor-pointer" href="/settings">
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Sign out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
