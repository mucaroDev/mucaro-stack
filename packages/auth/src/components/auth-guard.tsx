/**
 * Auth Guard Component
 * Protects routes by requiring authentication
 */

"use client";

import type { ReactNode } from "react";
import { useAuthContext } from "./auth-provider";

/**
 * Auth guard props
 */
export type AuthGuardProps = {
	children: ReactNode;
	fallback?: ReactNode;
	redirectTo?: string;
	requireAuth?: boolean;
}

/**
 * Auth guard component
 * Conditionally renders children based on authentication state
 */
export function AuthGuard({
	children,
	fallback,
	redirectTo,
	requireAuth = true,
}: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuthContext();

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div>
				Loading...
			</div>
		);
	}

	// Handle redirect if specified
	if (requireAuth && !isAuthenticated && redirectTo) {
		// In a real app, you'd use your router here
		// For now, we'll just show the fallback
		if (typeof window !== "undefined") {
			window.location.href = redirectTo;
		}
		return null;
	}

	// Show fallback if not authenticated and auth is required
	if (requireAuth && !isAuthenticated) {
		return fallback || (
			<div>
				<p>Please sign in to access this content.</p>
			</div>
		);
	}

	// Show fallback if authenticated but auth is not required (inverse guard)
	if (!requireAuth && isAuthenticated) {
		return fallback || null;
	}

	return <>{children}</>;
}

/**
 * Protected component - requires authentication
 */
export function Protected({ children, ...props }: Omit<AuthGuardProps, "requireAuth">) {
	return (
		<AuthGuard requireAuth={true} {...props}>
			{children}
		</AuthGuard>
	);
}

/**
 * Guest component - requires no authentication
 */
export function Guest({ children, ...props }: Omit<AuthGuardProps, "requireAuth">) {
	return (
		<AuthGuard requireAuth={false} {...props}>
			{children}
		</AuthGuard>
	);
}
