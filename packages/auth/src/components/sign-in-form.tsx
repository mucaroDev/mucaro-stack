/**
 * Sign In Form Component
 * Provides a form for user authentication
 */

"use client";

import { useState } from "react";
import { useSignIn } from "../client/hooks";
import { useAuthContext } from "./auth-provider";

/**
 * Sign in form props
 */
export type SignInFormProps = {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	callbackURL?: string;
	className?: string;
}

/**
 * Sign in form component
 * Provides email/password authentication form
 */
export function SignInForm({
	onSuccess,
	onError,
	callbackURL,
	className,
}: SignInFormProps) {
	const { authClient } = useAuthContext();
	const { signIn, isLoading, error } = useSignIn(authClient);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { data, error: signInError } = await signIn(
			formData.email,
			formData.password,
			{
				callbackURL,
				rememberMe: formData.rememberMe,
			},
		);

		if (signInError) {
			onError?.(signInError);
		} else if (data) {
			onSuccess?.();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	return (
		<form onSubmit={handleSubmit} className={className}>
			<div>
				<label htmlFor="email">
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					value={formData.email}
					onChange={handleInputChange}
					disabled={isLoading}
					autoComplete="email"
				/>
			</div>

			<div>
				<label htmlFor="password">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					value={formData.password}
					onChange={handleInputChange}
					disabled={isLoading}
					autoComplete="current-password"
				/>
			</div>

			<div>
				<label htmlFor="rememberMe">
					<input
						id="rememberMe"
						name="rememberMe"
						type="checkbox"
						checked={formData.rememberMe}
						onChange={handleInputChange}
						disabled={isLoading}
					/>
					Remember me
				</label>
			</div>

			{error && (
				<div role="alert">
					{error.message}
				</div>
			)}

			<button
				type="submit"
				disabled={isLoading}
			>
				{isLoading ? "Signing in..." : "Sign in"}
			</button>
		</form>
	);
}
