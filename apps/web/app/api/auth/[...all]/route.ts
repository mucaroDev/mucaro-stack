import { createAuthServer } from "@workspace/auth/server";
import { getDatabase } from "@/lib/db";

// Create auth server instance
async function getAuthServer() {
	const { db, error } = await getDatabase();

	if (!db || error) {
		throw new Error(`Database connection failed: ${error}`);
	}

	return createAuthServer({
		database: db,
		baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
		secret:
			process.env.BETTER_AUTH_SECRET ||
			"development-secret-please-change-in-production",
		trustedOrigins: [
			process.env.BETTER_AUTH_URL || "http://localhost:3000",
			...(process.env.TRUSTED_ORIGINS?.split(",") || []),
		],
		session: {
			expiresIn: 60 * 60 * 24 * 7, // 7 days
			updateAge: true,
		},
		emailVerification: {
			required: false, // Set to true in production
			autoSignInAfterVerification: true,
		},
	});
}

// Handle all auth requests
export async function GET(request: Request) {
	try {
		const auth = await getAuthServer();
		return auth.handler(request);
	} catch (error) {
		console.error("Auth GET error:", error);
		return new Response(
			JSON.stringify({
				error: "Authentication service unavailable",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 503,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

export async function POST(request: Request) {
	try {
		const auth = await getAuthServer();
		return auth.handler(request);
	} catch (error) {
		console.error("Auth POST error:", error);
		return new Response(
			JSON.stringify({
				error: "Authentication service unavailable",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 503,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
