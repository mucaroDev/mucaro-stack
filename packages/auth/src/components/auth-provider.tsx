/**
 * Authentication Provider Component
 * Provides authentication context to the application
 */

"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AuthClient } from "../client/index";
import { useAuth, type AuthState } from "../client/hooks";

/**
 * Authentication context interface
 */
export type AuthContextValue = AuthState & {
	authClient: AuthClient;
}

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Authentication provider props
 */
export type AuthProviderProps = {
	children: ReactNode;
	authClient: AuthClient;
}

/**
 * Authentication provider component
 * Wraps the application and provides authentication state
 */
export function AuthProvider({ children, authClient }: AuthProviderProps) {
	const authState = useAuth(authClient);

	const value: AuthContextValue = {
		...authState,
		authClient,
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

/**
 * Hook to use authentication context
 * Must be used within an AuthProvider
 */
export function useAuthContext(): AuthContextValue {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}

	return context;
}

/**
 * Hook to get current user
 */
export function useUser() {
	const { user, isLoading } = useAuthContext();
	return { user, isLoading };
}

/**
 * Hook to get current session
 */
export function useSession() {
	const { session, isLoading } = useAuthContext();
	return { session, isLoading };
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
	const { isAuthenticated, isLoading } = useAuthContext();
	return { isAuthenticated, isLoading };
}
