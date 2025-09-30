import { db } from "@workspace/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

if (!BETTER_AUTH_SECRET) {
	throw new Error("BETTER_AUTH_SECRET is required");
}

const SEVEN_DAYS_IN_SECONDS = 604_800;
const ONE_DAY_IN_SECONDS = 86_400;
const FIVE_MINUTES_IN_SECONDS = 300;

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	secret: BETTER_AUTH_SECRET,
	baseURL: BETTER_AUTH_URL,

	// Session configuration
	session: {
		expiresIn: SEVEN_DAYS_IN_SECONDS,
		updateAge: ONE_DAY_IN_SECONDS,
		cookieCache: {
			enabled: true,
			maxAge: FIVE_MINUTES_IN_SECONDS,
		},
	},

	// Simple email and password authentication
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, // No email verification needed
		minPasswordLength: 8,
		maxPasswordLength: 128,
		autoSignIn: true, // Automatically sign in after registration
	},

	// Rate limiting for security
	rateLimit: {
		enabled: true,
		window: 60, // 60 seconds
		max: 10, // 10 requests per window
	},

	// Security options
	advanced: {
		useSecureCookies: process.env.NODE_ENV === "production",
		cookiePrefix: "better-auth",
		crossSubDomainCookies: {
			enabled: false,
		},
	},

	// Trust localhost and production origins
	trustedOrigins: [
		"http://localhost:3000",
		"http://localhost:3001",
		...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") || []),
	],
});

export type Auth = typeof auth;
