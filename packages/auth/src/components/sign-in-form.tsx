import { type FormEvent, useState } from "react";
import { useAuthActions } from "../client/hooks.js";
import type { AuthClient } from "../client/index.js";

/**
 * Props for the SignInForm component
 */
export type SignInFormProps = {
	/**
	 * Auth client instance
	 */
	authClient: AuthClient;

	/**
	 * Callback fired on successful sign in
	 */
	onSuccess?: () => void;

	/**
	 * Callback fired on sign in error
	 */
	onError?: (error: Error) => void;

	/**
	 * Custom class name for the form
	 */
	className?: string;

	/**
	 * Whether to show the "Remember me" checkbox
	 * @default true
	 */
	showRememberMe?: boolean;

	/**
	 * Whether to show a link to the sign up form
	 * @default true
	 */
	showSignUpLink?: boolean;

	/**
	 * Custom render function for the sign up link
	 */
	renderSignUpLink?: () => React.ReactNode;

	/**
	 * Whether the form is disabled
	 * @default false
	 */
	disabled?: boolean;
};

/**
 * Unstyled sign-in form component
 *
 * Provides a complete sign-in form with email/password authentication.
 * This component is unstyled, so you can apply your own CSS classes and styling.
 *
 * @param props - SignInForm props
 * @returns JSX element
 *
 * @example
 * ```typescript
 * import { SignInForm } from "@workspace/auth/components";
 * import { authClient } from "./lib/auth";
 *
 * function LoginPage() {
 *   return (
 *     <div className="login-container">
 *       <SignInForm
 *         authClient={authClient}
 *         className="login-form"
 *         onSuccess={() => router.push('/dashboard')}
 *         onError={(error) => toast.error(error.message)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function SignInForm({
	authClient,
	onSuccess,
	onError,
	className,
	showRememberMe = true,
	showSignUpLink = true,
	renderSignUpLink,
	disabled = false,
}: SignInFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { signIn } = useAuthActions(authClient);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (disabled || isLoading) {
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await signIn({ email, password, rememberMe });
			onSuccess?.();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Sign in failed";
			setError(errorMessage);
			onError?.(err instanceof Error ? err : new Error(errorMessage));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className={className} noValidate onSubmit={handleSubmit}>
			{error && (
				<div data-testid="signin-error" role="alert">
					{error}
				</div>
			)}

			<div>
				<label htmlFor="signin-email">Email</label>
				<input
					autoComplete="email"
					data-testid="signin-email-input"
					disabled={disabled || isLoading}
					id="signin-email"
					onChange={(e) => setEmail(e.target.value)}
					required
					type="email"
					value={email}
				/>
			</div>

			<div>
				<label htmlFor="signin-password">Password</label>
				<input
					autoComplete="current-password"
					data-testid="signin-password-input"
					disabled={disabled || isLoading}
					id="signin-password"
					onChange={(e) => setPassword(e.target.value)}
					required
					type="password"
					value={password}
				/>
			</div>

			{showRememberMe && (
				<div>
					<label htmlFor="signin-remember">
						<input
							checked={rememberMe}
							data-testid="signin-remember-checkbox"
							disabled={disabled || isLoading}
							id="signin-remember"
							onChange={(e) => setRememberMe(e.target.checked)}
							type="checkbox"
						/>
						Remember me
					</label>
				</div>
			)}

			<button
				data-testid="signin-submit-button"
				disabled={disabled || isLoading || !email || !password}
				type="submit"
			>
				{isLoading ? "Signing in..." : "Sign in"}
			</button>

			{showSignUpLink && (
				<div>
					{renderSignUpLink ? (
						renderSignUpLink()
					) : (
						<p>
							Don't have an account?{" "}
							<a data-testid="signin-signup-link" href="/sign-up">
								Sign up
							</a>
						</p>
					)}
				</div>
			)}
		</form>
	);
}
