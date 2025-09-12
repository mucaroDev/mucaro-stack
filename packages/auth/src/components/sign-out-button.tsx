import { type ButtonHTMLAttributes, useState } from "react";
import { useAuthActions } from "../client/hooks.js";
import type { AuthClient } from "../client/index.js";

/**
 * Props for the SignOutButton component
 */
export type SignOutButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"onClick"
> & {
	/**
	 * Auth client instance
	 */
	authClient: AuthClient;

	/**
	 * Callback fired on successful sign out
	 */
	onSuccess?: () => void;

	/**
	 * Callback fired on sign out error
	 */
	onError?: (error: Error) => void;

	/**
	 * Custom content to display when loading
	 */
	loadingContent?: React.ReactNode;

	/**
	 * Whether to show a confirmation dialog before signing out
	 * @default false
	 */
	showConfirmation?: boolean;

	/**
	 * Custom confirmation message
	 * @default "Are you sure you want to sign out?"
	 */
	confirmationMessage?: string;
};

/**
 * Unstyled sign-out button component
 *
 * Provides a button that signs the user out when clicked.
 * This component is unstyled, so you can apply your own CSS classes and styling.
 *
 * @param props - SignOutButton props
 * @returns JSX element
 *
 * @example
 * ```typescript
 * import { SignOutButton } from "@workspace/auth/components";
 * import { authClient } from "./lib/auth";
 *
 * function UserMenu() {
 *   return (
 *     <div className="user-menu">
 *       <SignOutButton
 *         authClient={authClient}
 *         className="sign-out-btn"
 *         onSuccess={() => router.push('/login')}
 *         showConfirmation
 *       >
 *         Sign Out
 *       </SignOutButton>
 *     </div>
 *   );
 * }
 * ```
 */
export function SignOutButton({
	authClient,
	onSuccess,
	onError,
	loadingContent,
	showConfirmation = false,
	confirmationMessage = "Are you sure you want to sign out?",
	children = "Sign out",
	disabled,
	...buttonProps
}: SignOutButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { signOut } = useAuthActions(authClient);

	const handleSignOut = async () => {
		if (disabled || isLoading) {
			return;
		}

		if (showConfirmation && !window.confirm(confirmationMessage)) {
			return;
		}

		setIsLoading(true);

		try {
			await signOut();
			onSuccess?.();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Sign out failed";
			onError?.(err instanceof Error ? err : new Error(errorMessage));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			{...buttonProps}
			data-testid="signout-button"
			disabled={disabled || isLoading}
			onClick={handleSignOut}
			type="button"
		>
			{isLoading && loadingContent ? loadingContent : children}
		</button>
	);
}
