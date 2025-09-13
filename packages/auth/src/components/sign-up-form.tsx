/**
 * Sign Up Form Component
 * Provides a form for user registration
 */

"use client";

import { useState } from "react";
import { useSignUp } from "../client/hooks";
import { useAuthContext } from "./auth-provider";

// Constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Sign up form props
 */
export type SignUpFormProps = {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	callbackURL?: string;
	className?: string;
}

/**
 * Sign up form component
 * Provides user registration form
 */
export function SignUpForm({
	onSuccess,
	onError,
	callbackURL,
	className,
}: SignUpFormProps) {
	const { authClient } = useAuthContext();
	const { signUp, isLoading, error } = useSignUp(authClient);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const errors: Record<string, string> = {};

		if (!formData.name.trim()) {
			errors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			errors.email = "Email is required";
		} else if (!EMAIL_REGEX.test(formData.email)) {
			errors.email = "Please enter a valid email address";
		}

		if (!formData.password) {
			errors.password = "Password is required";
		} else if (formData.password.length < MIN_PASSWORD_LENGTH) {
			errors.password = "Password must be at least 8 characters long";
		}

		if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = "Passwords do not match";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		const { data, error: signUpError } = await signUp({
			name: formData.name,
			email: formData.email,
			password: formData.password,
			callbackURL,
		});

		if (signUpError) {
			onError?.(signUpError);
		} else if (data) {
			onSuccess?.();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));

		// Clear validation error when user starts typing
		if (validationErrors[name]) {
			setValidationErrors(prev => ({
				...prev,
				[name]: "",
			}));
		}
	};

	return (
		<form onSubmit={handleSubmit} className={className}>
			<div>
				<label htmlFor="name">
					Name
				</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					value={formData.name}
					onChange={handleInputChange}
					disabled={isLoading}
					autoComplete="name"
				/>
				{validationErrors.name && (
					<div role="alert">
						{validationErrors.name}
					</div>
				)}
			</div>

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
				{validationErrors.email && (
					<div role="alert">
						{validationErrors.email}
					</div>
				)}
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
					autoComplete="new-password"
				/>
				{validationErrors.password && (
					<div role="alert">
						{validationErrors.password}
					</div>
				)}
			</div>

			<div>
				<label htmlFor="confirmPassword">
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					required
					value={formData.confirmPassword}
					onChange={handleInputChange}
					disabled={isLoading}
					autoComplete="new-password"
				/>
				{validationErrors.confirmPassword && (
					<div role="alert">
						{validationErrors.confirmPassword}
					</div>
				)}
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
				{isLoading ? "Creating account..." : "Create account"}
			</button>
		</form>
	);
}
