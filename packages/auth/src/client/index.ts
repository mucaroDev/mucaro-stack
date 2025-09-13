/**
 * Better Auth client configuration
 * Provides client-side authentication utilities
 */

import { createAuthClient } from "better-auth/client";

/**
 * Client configuration options
 */
export type BetterAuthClientOptions = {
	baseURL?: string;
	fetchOptions?: RequestInit;
}

/**
 * Create Better Auth client instance
 * This function allows apps to create their own client with custom configuration
 */
export function createBetterAuthClient(options: BetterAuthClientOptions = {}) {
	const {
		baseURL = "http://localhost:3000",
		fetchOptions = {},
	} = options;

	return createAuthClient({
		baseURL: `${baseURL}/api/auth`,
		fetchOptions: {
			credentials: "include",
			...fetchOptions,
		},
	});
}

/**
 * Default auth client for development
 * Apps should create their own client using createBetterAuthClient
 */
export const authClient = createBetterAuthClient();

/**
 * Type exports
 */
export type AuthClient = ReturnType<typeof createBetterAuthClient>;
// Types will be inferred from the auth instance

// Re-export Better Auth client utilities
export { createAuthClient } from "better-auth/client";