import type { Database } from "@workspace/db/types";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { authSchema } from "../schema/index.js";

/**
 * Configuration options for Better Auth server
 */
export type AuthServerConfig = {
	/**
	 * Database instance from @workspace/db
	 */
	database: Database;

	/**
	 * Base URL for the application
	 * @default "http://localhost:3000"
	 */
	baseURL?: string;

	/**
	 * Secret key for signing tokens
	 * Should be a long, random string in production
	 */
	secret?: string;

	/**
	 * Trusted origins for CORS
	 * @default ["http://localhost:3000"]
	 */
	trustedOrigins?: string[];

	/**
	 * Session configuration
	 */
	session?: {
		/**
		 * Session expiration time in seconds
		 * @default 7 days (604800 seconds)
		 */
		expiresIn?: number;

		/**
		 * Whether to update session expiration on activity
		 * @default true
		 */
		updateAge?: boolean;
	};

	/**
	 * Email verification settings
	 */
	emailVerification?: {
		/**
		 * Whether email verification is required
		 * @default false
		 */
		required?: boolean;

		/**
		 * Auto sign in after email verification
		 * @default true
		 */
		autoSignInAfterVerification?: boolean;
	};

	/**
	 * Rate limiting configuration
	 */
	rateLimit?: {
		/**
		 * Enable rate limiting
		 * @default true
		 */
		enabled?: boolean;

		/**
		 * Time window in seconds
		 * @default 60
		 */
		window?: number;

		/**
		 * Maximum requests per window
		 * @default 100
		 */
		max?: number;
	};
};

/**
 * Create a Better Auth instance with proper configuration
 *
 * @param config - Auth server configuration
 * @returns Better Auth instance
 *
 * @example
 * ```typescript
 * import { createDatabase } from "@workspace/db/connection";
 * import { createAuthServer } from "@workspace/auth/server";
 *
 * const db = createDatabase({
 *   connectionString: process.env.DATABASE_URL
 * });
 *
 * export const auth = createAuthServer({
 *   database: db,
 *   baseURL: process.env.BETTER_AUTH_URL,
 *   secret: process.env.BETTER_AUTH_SECRET,
 *   trustedOrigins: [process.env.APP_URL],
 * });
 * ```
 */
export function createAuthServer(config: AuthServerConfig) {
	const {
		database,
		baseURL = "http://localhost:3000",
		secret,
		trustedOrigins = ["http://localhost:3000"],
		session = {},
		emailVerification = {},
		rateLimit = {},
	} = config;

	if (!secret) {
		throw new Error(
			"BETTER_AUTH_SECRET is required. Please set this environment variable to a secure random string."
		);
	}

	return betterAuth({
		database: drizzleAdapter(database, {
			provider: "pg",
			schema: authSchema,
		}),

		baseURL,
		secret,
		trustedOrigins,

		session: {
			expiresIn: session.expiresIn ?? 604_800, // 7 days (60 * 60 * 24 * 7)
			updateAge: session.updateAge ?? true,
		},

		emailAndPassword: {
			enabled: true,
			requireEmailVerification: emailVerification.required ?? false,
			autoSignInAfterVerification:
				emailVerification.autoSignInAfterVerification ?? true,
		},

		rateLimit:
			rateLimit.enabled !== false
				? {
						window: rateLimit.window ?? 60, // 1 minute
						max: rateLimit.max ?? 100, // 100 requests per minute
					}
				: undefined,

		// Enable advanced security features
		advanced: {
			crossSubDomainCookies: {
				enabled: false, // Set to true if using subdomains
			},
			useSecureCookies: process.env.NODE_ENV === "production",
		},
	});
}

/**
 * Type for the auth instance
 */
export type AuthServer = ReturnType<typeof createAuthServer>;

/**
 * Re-export Better Auth types for convenience
 */
export type { Session, User } from "better-auth/types";
