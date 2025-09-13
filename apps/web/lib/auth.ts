/**
 * Authentication client configuration
 * Provides auth client instance for the web app
 */

import { createBetterAuthClient } from "@workspace/auth/client";

/**
 * Auth client instance for the web app
 */
export const authClient = createBetterAuthClient({
	baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
	fetchOptions: {
		// Add any custom fetch options here
		credentials: "include",
	},
});

/**
 * Type for the auth client
 */
export type AuthClient = typeof authClient;
