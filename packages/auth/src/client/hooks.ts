import { useSession } from "better-auth/react";
import { useCallback } from "react";
import type { AuthClient } from "./index.js";

/**
 * Enhanced auth hooks for better developer experience
 */

/**
 * Hook to get authentication status and user data
 *
 * @returns Object with session data and loading state
 *
 * @example
 * ```typescript
 * function UserProfile() {
 *   const { data: session, isPending, error } = useAuth();
 *
 *   if (isPending) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!session) return <div>Not authenticated</div>;
 *
 *   return <div>Welcome, {session.user.name}!</div>;
 * }
 * ```
 */
export function useAuth() {
	return useSession();
}

/**
 * Hook to get the current user, or null if not authenticated
 *
 * @returns Current user or null
 *
 * @example
 * ```typescript
 * function UserAvatar() {
 *   const user = useUser();
 *
 *   if (!user) return null;
 *
 *   return (
 *     <img
 *       src={user.image || '/default-avatar.png'}
 *       alt={user.name}
 *     />
 *   );
 * }
 * ```
 */
export function useUser() {
	const { data: session } = useSession();
	return session?.user ?? null;
}

/**
 * Hook to check if user is authenticated
 *
 * @returns Boolean indicating authentication status
 *
 * @example
 * ```typescript
 * function ProtectedContent() {
 *   const isAuthenticated = useIsAuthenticated();
 *
 *   if (!isAuthenticated) {
 *     return <SignInForm />;
 *   }
 *
 *   return <SecretContent />;
 * }
 * ```
 */
export function useIsAuthenticated(): boolean {
	const { data: session } = useSession();
	return !!session?.user;
}

/**
 * Hook for authentication actions
 *
 * @param authClient - The auth client instance
 * @returns Object with authentication action functions
 *
 * @example
 * ```typescript
 * function AuthButtons() {
 *   const { signIn, signUp, signOut, isLoading } = useAuthActions(authClient);
 *
 *   return (
 *     <div>
 *       <button
 *         onClick={() => signIn({ email: 'user@example.com', password: 'password' })}
 *         disabled={isLoading}
 *       >
 *         Sign In
 *       </button>
 *       <button
 *         onClick={() => signOut()}
 *         disabled={isLoading}
 *       >
 *         Sign Out
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuthActions(authClient: AuthClient) {
	const { data: session } = useSession();

	const signIn = useCallback(
		async (credentials: {
			email: string;
			password: string;
			rememberMe?: boolean;
		}) => {
			try {
				const result = await authClient.signIn.email(credentials);
				if (result.error) {
					throw new Error(result.error.message);
				}
				return result;
			} catch (error) {
				throw error instanceof Error ? error : new Error("Sign in failed");
			}
		},
		[authClient]
	);

	const signUp = useCallback(
		async (userData: {
			name: string;
			email: string;
			password: string;
			image?: string;
		}) => {
			try {
				const result = await authClient.signUp.email(userData);
				if (result.error) {
					throw new Error(result.error.message);
				}
				return result;
			} catch (error) {
				throw error instanceof Error ? error : new Error("Sign up failed");
			}
		},
		[authClient]
	);

	const signOut = useCallback(async () => {
		try {
			await authClient.signOut();
		} catch (error) {
			throw error instanceof Error ? error : new Error("Sign out failed");
		}
	}, [authClient]);

	const updateUser = useCallback(
		async (updates: { name?: string; image?: string }) => {
			try {
				const result = await authClient.updateUser(updates);
				if (result.error) {
					throw new Error(result.error.message);
				}
				return result;
			} catch (error) {
				throw error instanceof Error ? error : new Error("Update user failed");
			}
		},
		[authClient]
	);

	const changePassword = useCallback(
		async (passwords: { currentPassword: string; newPassword: string }) => {
			try {
				const result = await authClient.changePassword(passwords);
				if (result.error) {
					throw new Error(result.error.message);
				}
				return result;
			} catch (error) {
				throw error instanceof Error
					? error
					: new Error("Change password failed");
			}
		},
		[authClient]
	);

	return {
		signIn,
		signUp,
		signOut,
		updateUser,
		changePassword,
		isAuthenticated: !!session?.user,
	};
}
