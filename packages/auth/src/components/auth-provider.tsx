import type { ReactNode } from "react";
import type { AuthClient } from "../client/index.js";

/**
 * Props for the AuthProvider component
 */
export type AuthProviderProps = {
	/**
	 * Auth client instance
	 */
	authClient: AuthClient;

	/**
	 * Children components
	 */
	children: ReactNode;
};

/**
 * Authentication provider component
 *
 * Wraps your app to provide authentication context to all child components.
 * This is required for the auth hooks and components to work properly.
 *
 * @param props - AuthProvider props
 * @returns JSX element
 *
 * @example
 * ```typescript
 * import { AuthProvider } from "@workspace/auth/components";
 * import { authClient } from "./lib/auth";
 *
 * function App() {
 *   return (
 *     <AuthProvider authClient={authClient}>
 *       <YourAppContent />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function AuthProvider({ authClient, children }: AuthProviderProps) {
	// Better Auth's React client automatically provides context
	// when using createAuthClient from "better-auth/react"
	// The session state is managed internally
	return <>{children}</>;
}

/**
 * Higher-order component to wrap your app with authentication
 *
 * @param authClient - Auth client instance
 * @returns Function that wraps a component with auth provider
 *
 * @example
 * ```typescript
 * import { withAuth } from "@workspace/auth/components";
 * import { authClient } from "./lib/auth";
 *
 * const AppWithAuth = withAuth(authClient)(App);
 *
 * export default AppWithAuth;
 * ```
 */
export function withAuth(authClient: AuthClient) {
	return function WithAuthProvider<P extends object>(
		Component: React.ComponentType<P>
	) {
		return function AuthWrappedComponent(props: P) {
			return (
				<AuthProvider authClient={authClient}>
					<Component {...props} />
				</AuthProvider>
			);
		};
	};
}
