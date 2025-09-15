"use client";

import { SignedIn, SignedOut, UserButton } from "@workspace/auth/client";
import { Button } from "@workspace/ui/components/button";

export function AuthNav() {
	return (
		<div className="flex items-center space-x-4">
			<SignedOut>
				<Button asChild variant="ghost">
					<a href="/sign-in">Sign in</a>
				</Button>
				<Button asChild>
					<a href="/sign-up">Sign up</a>
				</Button>
			</SignedOut>
			<SignedIn>
				<UserButton
					appearance={{
						elements: {
							avatarBox: "w-8 h-8",
						},
					}}
				/>
			</SignedIn>
		</div>
	);
}
