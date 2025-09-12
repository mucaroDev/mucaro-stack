import type { ReactNode } from "react";
import { useAuth, useIsAuthenticated } from "../client/hooks.js";

/**
 * Props for the AuthGuard component
 */
export type AuthGuardProps = {
	/**
	 * Content to render when user is authenticated
	 */
	children: ReactNode;

	/**
	 * Content to render when user is not authenticated
	 */
	fallback?: ReactNode;

	/**
	 * Content to render while authentication status is loading
	 */
	loading?: ReactNode;

	/**
	 * Whether to require email verification
	 * @default false
	 */
	requireEmailVerification?: boolean;

	/**
	 * Content to render when email verification is required
	 */
	emailVerificationFallback?: ReactNode;

	/**
	 * Custom function to determine if user meets access requirements
	 */
	canAccess?: (user: unknown) => boolean;

	/**
	 * Content to render when custom access check fails
	 */
	accessDeniedFallback?: ReactNode;
};

/**
 * Authentication guard component
 *
 * Conditionally renders content based on authentication status and requirements.
 * Useful for protecting routes or content that requires authentication.
 *
 * @param props - AuthGuard props
 * @returns JSX element
 *
 * @example
 * ```typescript
 * import { AuthGuard } from "@workspace/auth/components";
 *
 * function ProtectedPage() {
 *   return (
 *     <AuthGuard
 *       fallback={<SignInPrompt />}
 *       loading={<Spinner />}
 *     >
 *       <SecretContent />
 *     </AuthGuard>
 *   );
 * }
 *
 * // With email verification requirement
 * function VerifiedOnlyContent() {
 *   return (
 *     <AuthGuard
 *       requireEmailVerification
 *       emailVerificationFallback={<EmailVerificationPrompt />}
 *       fallback={<SignInForm />}
 *     >
 *       <PremiumFeatures />
 *     </AuthGuard>
 *   );
 * }
 *
 * // With custom access control
 * function AdminPanel() {
 *   return (
 *     <AuthGuard
 *       canAccess={(user) => user.role === 'admin'}
 *       accessDeniedFallback={<div>Admin access required</div>}
 *       fallback={<SignInForm />}
 *     >
 *       <AdminDashboard />
 *     </AuthGuard>
 *   );
 * }
 * ```
 */
export function AuthGuard({
	children,
	fallback = null,
	loading = null,
	requireEmailVerification = false,
	emailVerificationFallback = null,
	canAccess,
	accessDeniedFallback = null,
}: AuthGuardProps) {
	const { data: session, isPending } = useAuth();
	const isAuthenticated = useIsAuthenticated();

	// Show loading state while checking authentication
	if (isPending) {
		return <>{loading}</>;
	}

	// Not authenticated
	if (!(isAuthenticated && session)) {
		return <>{fallback}</>;
	}

	const user = session.user;

	// Check email verification requirement
	if (requireEmailVerification && !user.emailVerified) {
		return <>{emailVerificationFallback || fallback}</>;
	}

	// Check custom access requirements
	if (canAccess && !canAccess(user)) {
		return <>{accessDeniedFallback || fallback}</>;
	}

	// All checks passed, render protected content
	return <>{children}</>;
}

/**
 * Higher-order component version of AuthGuard
 *
 * @param guardProps - Auth guard configuration
 * @returns Function that wraps a component with auth guard
 *
 * @example
 * ```typescript
 * import { withAuthGuard } from "@workspace/auth/components";
 *
 * const ProtectedComponent = withAuthGuard({
 *   fallback: <SignInForm />,
 *   requireEmailVerification: true,
 * })(MyComponent);
 * ```
 */
export function withAuthGuard(guardProps: Omit<AuthGuardProps, "children">) {
	return function WithAuthGuard<P extends object>(
		Component: React.ComponentType<P>
	) {
		return function AuthGuardedComponent(props: P) {
			return (
				<AuthGuard {...guardProps}>
					<Component {...props} />
				</AuthGuard>
			);
		};
	};
}
