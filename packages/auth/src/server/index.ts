/**
 * Better Auth server configuration
 * Provides authentication server instance with database integration
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, authUser as user, verification } from "@workspace/db/schema";

// Constants
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const SEVEN_DAYS_IN_SECONDS = SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
const ONE_DAY_IN_SECONDS = SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
const FIVE_MINUTES_IN_SECONDS = SECONDS_PER_MINUTE * 5;
const ONE_MINUTE_IN_SECONDS = SECONDS_PER_MINUTE;
const MAX_REQUESTS_PER_WINDOW = 100;

/**
 * Better Auth server configuration
 * Configured with email/password authentication and database integration
 */
export const auth = betterAuth({
	/**
	 * Database configuration using Drizzle adapter
	 */
	database: drizzleAdapter(
		// Database connection will be injected by the consuming app
		{} as any,
		{
			provider: "pg",
			schema: {
				user,
				session,
				account,
				verification,
			},
		},
	),

	/**
	 * Email and password authentication
	 */
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		requireEmailVerification: false, // Can be enabled based on requirements
	},

	/**
	 * Session configuration
	 */
	session: {
		expiresIn: SEVEN_DAYS_IN_SECONDS, // 7 days
		updateAge: ONE_DAY_IN_SECONDS, // 1 day
		cookieCache: {
			enabled: true,
			maxAge: FIVE_MINUTES_IN_SECONDS, // 5 minutes
		},
	},

	/**
	 * Security configuration
	 */
	advanced: {
		generateId: false, // Use database default ID generation
		crossSubDomainCookies: {
			enabled: false, // Enable if needed for subdomains
		},
	},

	/**
	 * CSRF protection
	 */
	csrf: {
		enabled: true,
		secret: process.env.AUTH_SECRET,
	},

	/**
	 * Rate limiting for authentication endpoints
	 */
	rateLimit: {
		enabled: true,
		window: ONE_MINUTE_IN_SECONDS, // 1 minute window
		max: MAX_REQUESTS_PER_WINDOW, // 100 requests per window
	},

	/**
	 * Trusted origins for CORS
	 */
	trustedOrigins: [
		"http://localhost:3000",
		"https://localhost:3000",
		...(process.env.TRUSTED_ORIGINS?.split(",") || []),
	],

	/**
	 * Logger configuration
	 */
	logger: {
		level: process.env.NODE_ENV === "development" ? "debug" : "warn",
		disabled: process.env.NODE_ENV === "test",
	},
});

/**
 * Create Better Auth instance with custom database connection
 * This allows apps to inject their own database connection
 */
export function createBetterAuth(db: any) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: {
				user,
				session,
				account,
				verification,
			},
		}),

		emailAndPassword: {
			enabled: true,
			autoSignIn: true,
			minPasswordLength: 8,
			maxPasswordLength: 128,
			requireEmailVerification: false,
		},

		session: {
		expiresIn: SEVEN_DAYS_IN_SECONDS, // 7 days
		updateAge: ONE_DAY_IN_SECONDS, // 1 day
		cookieCache: {
			enabled: true,
			maxAge: FIVE_MINUTES_IN_SECONDS, // 5 minutes
		},
		},

		advanced: {
			generateId: false,
			crossSubDomainCookies: {
				enabled: false,
			},
		},

		csrf: {
			enabled: true,
			secret: process.env.AUTH_SECRET,
		},

		rateLimit: {
			enabled: true,
		window: ONE_MINUTE_IN_SECONDS,
		max: MAX_REQUESTS_PER_WINDOW,
		},

		trustedOrigins: [
			"http://localhost:3000",
			"https://localhost:3000",
			...(process.env.TRUSTED_ORIGINS?.split(",") || []),
		],

		logger: {
			level: process.env.NODE_ENV === "development" ? "debug" : "warn",
			disabled: process.env.NODE_ENV === "test",
		},
	});
}

/**
 * Type exports for Better Auth
 */
export type Auth = typeof auth;