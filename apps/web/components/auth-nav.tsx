"use client";

import { useAuthActions, useUser } from "@workspace/auth/client";
import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth";

export function AuthNav() {
	const user = useUser(authClient);
	const { signOut } = useAuthActions(authClient);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);

	const handleSignOut = async () => {
		setIsSigningOut(true);
		try {
			await signOut();
		} catch (error) {
			console.error("Sign out error:", error);
		} finally {
			setIsSigningOut(false);
			setIsDropdownOpen(false);
		}
	};

	if (!user) {
		return (
			<div className="flex items-center space-x-4">
				<a
					className="rounded-md px-3 py-2 font-medium text-gray-600 text-sm hover:text-gray-900"
					href="/sign-in"
				>
					Sign in
				</a>
				<a
					className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700"
					href="/sign-up"
				>
					Sign up
				</a>
			</div>
		);
	}

	return (
		<div className="relative">
			<button
				className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white p-2 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				type="button"
			>
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
					{user.image ? (
						<img
							alt={user.name}
							className="h-8 w-8 rounded-full"
							src={user.image}
						/>
					) : (
						<User className="h-4 w-4 text-blue-600" />
					)}
				</div>
				<span className="hidden font-medium text-gray-900 text-sm sm:block">
					{user.name}
				</span>
			</button>

			{isDropdownOpen && (
				<div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<div className="border-gray-100 border-b px-4 py-2 text-gray-700 text-sm">
							<div className="font-medium">{user.name}</div>
							<div className="text-gray-500">{user.email}</div>
						</div>

						<button
							className="flex w-full items-center px-4 py-2 text-gray-700 text-sm hover:bg-gray-100"
							onClick={() => setIsDropdownOpen(false)}
							type="button"
						>
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</button>

						<button
							className="flex w-full items-center px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 disabled:opacity-50"
							disabled={isSigningOut}
							onClick={handleSignOut}
							type="button"
						>
							<LogOut className="mr-2 h-4 w-4" />
							{isSigningOut ? "Signing out..." : "Sign out"}
						</button>
					</div>
				</div>
			)}

			{/* Backdrop to close dropdown */}
			{isDropdownOpen && (
				<div
					className="fixed inset-0 z-40"
					onClick={() => setIsDropdownOpen(false)}
				/>
			)}
		</div>
	);
}
