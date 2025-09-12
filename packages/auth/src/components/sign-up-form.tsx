import { type FormEvent, useState } from "react";
import { useAuthActions } from "../client/hooks.js";
import type { AuthClient } from "../client/index.js";

/**
 * Props for the SignUpForm component
 */
export type SignUpFormProps = {
	/**
	 * Auth client instance
	 */
	authClient: AuthClient;

	/**
	 * Callback fired on successful sign up
	 */
	onSuccess?: () => void;

	/**
	 * Callback fired on sign up error
	 */
	onError?: (error: Error) => void;

	/**
	 * Custom class name for the form
	 */
	className?: string;

	/**
	 * Whether to show a link to the sign in form
	 * @default true
	 */
	showSignInLink?: boolean;

	/**
	 * Custom render function for the sign in link
	 */
	renderSignInLink?: () => React.ReactNode;

	/**
	 * Whether the form is disabled
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Minimum password length
	 * @default 8
	 */
	minPasswordLength?: number;

	/**
	 * Whether to require password confirmation
	 * @default true
	 */
	requirePasswordConfirmation?: boolean;
};

/**
 * Unstyled sign-up form component
 *
 * Provides a complete sign-up form with email/password registration.
 * This component is unstyled, so you can apply your own CSS classes and styling.
 *
 * @param props - SignUpForm props
 * @returns JSX element
 *
 * @example
 * ```typescript
 * import { SignUpForm } from "@workspace/auth/components";
 * import { authClient } from "./lib/auth";
 *
 * function RegisterPage() {
 *   return (
 *     <div className="register-container">
 *       <SignUpForm
 *         authClient={authClient}
 *         className="register-form"
 *         onSuccess={() => router.push('/welcome')}
 *         onError={(error) => toast.error(error.message)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function SignUpForm({
	authClient,
	onSuccess,
	onError,
	className,
	showSignInLink = true,
	renderSignInLink,
	disabled = false,
	minPasswordLength = 8,
	requirePasswordConfirmation = true,
}: SignUpFormProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { signUp } = useAuthActions(authClient);

	const validateForm = () => {
		if (!name.trim()) {
			setError("Name is required");
			return false;
		}

		if (!email.trim()) {
			setError("Email is required");
			return false;
		}

		if (password.length < minPasswordLength) {
			setError(`Password must be at least ${minPasswordLength} characters`);
			return false;
		}

		if (requirePasswordConfirmation && password !== confirmPassword) {
			setError("Passwords do not match");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (disabled || isLoading) {
			return;
		}

		setError(null);

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			await signUp({ name: name.trim(), email: email.trim(), password });
			onSuccess?.();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Sign up failed";
			setError(errorMessage);
			onError?.(err instanceof Error ? err : new Error(errorMessage));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className={className} noValidate onSubmit={handleSubmit}>
			{error && (
				<div data-testid="signup-error" role="alert">
					{error}
				</div>
			)}

			<div>
				<label htmlFor="signup-name">Name</label>
				<input
					autoComplete="name"
					data-testid="signup-name-input"
					disabled={disabled || isLoading}
					id="signup-name"
					onChange={(e) => setName(e.target.value)}
					required
					type="text"
					value={name}
				/>
			</div>

			<div>
				<label htmlFor="signup-email">Email</label>
				<input
					autoComplete="email"
					data-testid="signup-email-input"
					disabled={disabled || isLoading}
					id="signup-email"
					onChange={(e) => setEmail(e.target.value)}
					required
					type="email"
					value={email}
				/>
			</div>

			<div>
				<label htmlFor="signup-password">Password</label>
				<input
					autoComplete="new-password"
					data-testid="signup-password-input"
					disabled={disabled || isLoading}
					id="signup-password"
					minLength={minPasswordLength}
					onChange={(e) => setPassword(e.target.value)}
					required
					type="password"
					value={password}
				/>
				{minPasswordLength > 0 && (
					<small>Must be at least {minPasswordLength} characters</small>
				)}
			</div>

			{requirePasswordConfirmation && (
				<div>
					<label htmlFor="signup-confirm-password">Confirm Password</label>
					<input
						autoComplete="new-password"
						data-testid="signup-confirm-password-input"
						disabled={disabled || isLoading}
						id="signup-confirm-password"
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						type="password"
						value={confirmPassword}
					/>
				</div>
			)}

			<button
				data-testid="signup-submit-button"
				disabled={
					disabled ||
					isLoading ||
					!name ||
					!email ||
					!password ||
					(requirePasswordConfirmation && !confirmPassword)
				}
				type="submit"
			>
				{isLoading ? "Creating account..." : "Sign up"}
			</button>

			{showSignInLink && (
				<div>
					{renderSignInLink ? (
						renderSignInLink()
					) : (
						<p>
							Already have an account?{" "}
							<a data-testid="signup-signin-link" href="/sign-in">
								Sign in
							</a>
						</p>
					)}
				</div>
			)}
		</form>
	);
}
