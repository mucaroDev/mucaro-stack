"use client";

import { useSession } from "@workspace/auth/client";
import { Lock, Shield, User } from "lucide-react";

export function ProtectedContent() {
	const { data: session, isPending } = useSession();

	if (isPending) {
		return (
			<div className="rounded-lg border-2 border-border border-dashed p-6 text-center">
				<div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-muted" />
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	if (!session) {
		return (
			<div className="rounded-lg border-2 border-border border-dashed p-6 text-center">
				<Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="mb-2 font-medium text-foreground text-lg">
					Protected Content
				</h3>
				<p className="mb-4 text-muted-foreground">
					This content is only visible to authenticated users.
				</p>
				<div className="space-x-4">
					<a
						className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
						href="/auth/sign-in"
					>
						Sign in to view
					</a>
					<a
						className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 font-medium text-foreground text-sm hover:bg-accent hover:text-accent-foreground"
						href="/auth/sign-up"
					>
						Create account
					</a>
				</div>
			</div>
		);
	}

	const user = session.user;

	return (
		<div className="rounded-lg border border-green-500/20 bg-green-500/5 p-6">
			<div className="flex items-start">
				<Shield className="mt-1 h-6 w-6 text-green-600 dark:text-green-400" />
				<div className="ml-3">
					<h3 className="mb-2 font-medium text-foreground text-lg">
						🎉 Welcome to Protected Content!
					</h3>
					<div className="mb-4 text-foreground">
						<p className="mb-2">
							Congratulations! You're successfully authenticated and can see
							this protected content.
						</p>
						<div className="rounded-md border border-border bg-card p-4">
							<div className="mb-2 flex items-center">
								<User className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
								<span className="font-medium">User Information:</span>
							</div>
							<ul className="space-y-1 text-sm">
								<li>
									<strong>Name:</strong> {user.name || "Not provided"}
								</li>
								<li>
									<strong>Email:</strong> {user.email}
								</li>
								<li>
									<strong>ID:</strong> {user.id}
								</li>
								<li>
									<strong>Email Verified:</strong>{" "}
									{user.emailVerified ? "✅ Yes" : "❌ No"}
								</li>
							</ul>
						</div>
					</div>
					<div className="text-green-600 text-sm dark:text-green-400">
						<p>This demonstrates how authentication works with Better Auth:</p>
						<ul className="mt-2 list-inside list-disc space-y-1">
							<li>Session management with Better Auth</li>
							<li>Protected routes and content</li>
							<li>User data access via hooks</li>
							<li>Support for multiple auth methods</li>
							<li>Built-in 2FA and advanced features</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
