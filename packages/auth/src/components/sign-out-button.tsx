/**
 * Sign Out Button Component
 * Provides a button for user sign out
 */

"use client";

import { useSignOut } from "../client/hooks";
import { useAuthContext } from "./auth-provider";

/**
 * Sign out button props
 */
export type SignOutButtonProps = {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

/**
 * Sign out button component
 * Provides a button to sign out the current user
 */
export function SignOutButton({
	onSuccess,
	onError,
	children = "Sign out",
	className,
	disabled,
}: SignOutButtonProps) {
	const { authClient } = useAuthContext();
	const { signOut, isLoading, error } = useSignOut(authClient);

	const handleSignOut = async () => {
		const { error: signOutError } = await signOut();

		if (signOutError) {
			onError?.(signOutError);
		} else {
			onSuccess?.();
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={handleSignOut}
				disabled={disabled || isLoading}
				className={className}
			>
				{isLoading ? "Signing out..." : children}
			</button>

			{error && (
				<div role="alert">
					{error.message}
				</div>
			)}
		</>
	);
}
