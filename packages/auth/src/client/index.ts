import { createAuthClient } from "better-auth/react";
// import type { AuthServer } from "../server/index.js";

/**
 * Configuration options for Better Auth client
 */
export interface AuthClientConfig {
	/**
	 * Base URL where your auth server is running
	 * @default "http://localhost:3000"
	 */
	baseURL?: string;

	/**
	 * Additional fetch options for auth requests
	 */
	fetchOptions?: RequestInit;
}

/**
 * Create a Better Auth client instance
 *
 * @param config - Client configuration options
 * @returns Better Auth client with React hooks
 *
 * @example
 * ```typescript
 * // In your app's auth setup
 * import { createAuthClient } from "@workspace/auth/client";
 *
 * export const authClient = createAuthClient({
 *   baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000"
 * });
 * ```
 */
export function createBetterAuthClient(config: AuthClientConfig = {}) {
	const { baseURL = "http://localhost:3000", fetchOptions } = config;

	return createAuthClient({
		baseURL,
		fetchOptions,
	});
}

/**
 * Type for the auth client instance
 */
export type AuthClient = ReturnType<typeof createBetterAuthClient>;

/**
 * Infer the auth client type from the server
 */
export type InferAuthClient<T = any> = ReturnType<typeof createAuthClient> & {
	$Infer: T;
};

/**
 * Re-export useful types and hooks from better-auth/react
 */
export { useSession } from "better-auth/react";
export type { Session, User } from "better-auth/types";
