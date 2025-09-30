"use client";

import { authClient } from "@workspace/auth/client";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignInForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleEmailSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await authClient.signIn.email(
				{
					email,
					password,
					callbackURL: callbackUrl,
				},
				{
					onSuccess: () => {
						router.push(callbackUrl);
						router.refresh();
					},
					onError: (ctx) => {
						setError(ctx.error.message || "Failed to sign in");
					},
				}
			);
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-svh items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">Sign in</CardTitle>
					<CardDescription>
						Enter your email and password to sign in to your account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form className="space-y-4" onSubmit={handleEmailSignIn}>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								disabled={isLoading}
								id="email"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="name@example.com"
								required
								type="email"
								value={email}
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<Link
									className="text-muted-foreground text-sm hover:text-primary"
									href="/auth/reset-password"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								disabled={isLoading}
								id="password"
								onChange={(e) => setPassword(e.target.value)}
								required
								type="password"
								value={password}
							/>
						</div>
						<Button className="w-full" disabled={isLoading} type="submit">
							{isLoading ? "Signing in..." : "Sign in"}
						</Button>
					</form>
				</CardContent>
				<CardFooter>
					<p className="w-full text-center text-muted-foreground text-sm">
						Don't have an account?{" "}
						<Link className="text-primary hover:underline" href="/auth/sign-up">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}

export default function SignInPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SignInForm />
		</Suspense>
	);
}
