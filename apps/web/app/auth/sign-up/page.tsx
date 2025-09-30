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

function SignUpForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleEmailSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await authClient.signUp.email(
				{
					email,
					password,
					name,
					callbackURL: callbackUrl,
				},
				{
					onSuccess: () => {
						router.push(callbackUrl);
						router.refresh();
					},
					onError: (ctx) => {
						setError(ctx.error.message || "Failed to sign up");
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
					<CardTitle className="text-2xl">Create an account</CardTitle>
					<CardDescription>
						Enter your information to create your account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form className="space-y-4" onSubmit={handleEmailSignUp}>
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								disabled={isLoading}
								id="name"
								onChange={(e) => setName(e.target.value)}
								placeholder="John Doe"
								required
								type="text"
								value={name}
							/>
						</div>
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
							<Label htmlFor="password">Password</Label>
							<Input
								disabled={isLoading}
								id="password"
								minLength={8}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Minimum 8 characters"
								required
								type="password"
								value={password}
							/>
						</div>
						<Button className="w-full" disabled={isLoading} type="submit">
							{isLoading ? "Creating account..." : "Create account"}
						</Button>
					</form>
				</CardContent>
				<CardFooter>
					<p className="w-full text-center text-muted-foreground text-sm">
						Already have an account?{" "}
						<Link className="text-primary hover:underline" href="/auth/sign-in">
							Sign in
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}

export default function SignUpPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SignUpForm />
		</Suspense>
	);
}
