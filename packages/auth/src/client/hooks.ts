/**
 * React hooks for Better Auth
 * Provides React hooks for authentication state and actions
 */

"use client";

import { useEffect, useState } from "react";
import type { AuthClient } from "./index";

// Basic auth types
export type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type Session = {
	id: string;
	userId: string;
	expiresAt: Date;
	token: string;
	createdAt: Date;
	updatedAt: Date;
	ipAddress?: string | null;
	userAgent?: string | null;
	user: User;
};

/**
 * Authentication state interface
 */
export type AuthState = {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: Error | null;
}

/**
 * Hook to get authentication state
 */
export function useAuth(authClient: AuthClient): AuthState {
	const [state, setState] = useState<AuthState>({
		user: null,
		session: null,
		isLoading: true,
		isAuthenticated: false,
		error: null,
	});

	useEffect(() => {
		let mounted = true;

		// Get initial session
		const getSession = async () => {
			try {
				const { data: sessionData, error: sessionError } = await authClient.getSession();

				if (!mounted) {
					return;
				}

				if (sessionError) {
					setState({
						user: null,
						session: null,
						isLoading: false,
						isAuthenticated: false,
						error: new Error(sessionError.message),
					});
					return;
				}

				setState({
					user: sessionData?.user || null,
					session: sessionData ? {
						id: sessionData.session?.id || "",
						userId: sessionData.user?.id || "",
						expiresAt: new Date(),
						token: "",
						createdAt: new Date(),
						updatedAt: new Date(),
						ipAddress: null,
						userAgent: null,
						user: sessionData.user,
					} : null,
					isLoading: false,
					isAuthenticated: !!sessionData?.user,
					error: null,
				});
			} catch (authError) {
				if (!mounted) {
					return;
				}

				setState({
					user: null,
					session: null,
					isLoading: false,
					isAuthenticated: false,
					error: authError instanceof Error ? authError : new Error("Unknown error"),
				});
			}
		};

		getSession();

		return () => {
			mounted = false;
		};
	}, [authClient]);

	return state;
}

/**
 * Hook return types
 */
export type UseSignInReturn = {
	signIn: (email: string, password: string, options?: {
		callbackURL?: string;
		rememberMe?: boolean;
	}) => Promise<{ data: unknown; error: Error | null }>;
	isLoading: boolean;
	error: Error | null;
};

export type UseSignUpReturn = {
	signUp: (data: {
		email: string;
		password: string;
		name: string;
		image?: string;
		callbackURL?: string;
	}) => Promise<{ data: unknown; error: Error | null }>;
	isLoading: boolean;
	error: Error | null;
};

export type UseSignOutReturn = {
	signOut: () => Promise<{ error: Error | null }>;
	isLoading: boolean;
	error: Error | null;
};

export type UseUpdateUserReturn = {
	updateUser: (data: {
		name?: string;
		image?: string;
	}) => Promise<{ data: unknown; error: Error | null }>;
	isLoading: boolean;
	error: Error | null;
};

/**
 * Hook for sign in functionality
 */
export function useSignIn(authClient: AuthClient) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const signIn = async (email: string, password: string, options?: {
		callbackURL?: string;
		rememberMe?: boolean;
	}) => {
		setIsLoading(true);
		setError(null);

		try {
			const { data, error: authError } = await authClient.signIn.email({
				email,
				password,
				callbackURL: options?.callbackURL,
				rememberMe: options?.rememberMe,
			});

			if (authError) {
				throw new Error(authError.message);
			}

			return { data, error: null };
		} catch (error) {
			const errorObj = error instanceof Error ? error : new Error("Sign in failed");
			setError(errorObj);
			return { data: null, error: errorObj };
		} finally {
			setIsLoading(false);
		}
	};

	return {
		signIn,
		isLoading,
		error,
	};
}

/**
 * Hook for sign up functionality
 */
export function useSignUp(authClient: AuthClient) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const signUp = async (data: {
		email: string;
		password: string;
		name: string;
		image?: string;
		callbackURL?: string;
	}) => {
		setIsLoading(true);
		setError(null);

		try {
			const { data: result, error: authError } = await authClient.signUp.email(data);

			if (authError) {
				throw new Error(authError.message);
			}

			return { data: result, error: null };
		} catch (error) {
			const errorObj = error instanceof Error ? error : new Error("Sign up failed");
			setError(errorObj);
			return { data: null, error: errorObj };
		} finally {
			setIsLoading(false);
		}
	};

	return {
		signUp,
		isLoading,
		error,
	};
}

/**
 * Hook for sign out functionality
 */
export function useSignOut(authClient: AuthClient) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const signOut = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const { error: authError } = await authClient.signOut();

			if (authError) {
				throw new Error(authError.message);
			}

			return { error: null };
		} catch (error) {
			const errorObj = error instanceof Error ? error : new Error("Sign out failed");
			setError(errorObj);
			return { error: errorObj };
		} finally {
			setIsLoading(false);
		}
	};

	return {
		signOut,
		isLoading,
		error,
	};
}

/**
 * Hook for updating user profile
 */
export function useUpdateUser(authClient: AuthClient) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const updateUser = async (data: {
		name?: string;
		image?: string;
	}) => {
		setIsLoading(true);
		setError(null);

		try {
			const { data: result, error: authError } = await authClient.updateUser(data);

			if (authError) {
				throw new Error(authError.message);
			}

			return { data: result, error: null };
		} catch (error) {
			const errorObj = error instanceof Error ? error : new Error("Update failed");
			setError(errorObj);
			return { data: null, error: errorObj };
		} finally {
			setIsLoading(false);
		}
	};

	return {
		updateUser,
		isLoading,
		error,
	};
}