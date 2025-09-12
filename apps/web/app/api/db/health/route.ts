import { NextResponse } from "next/server";
import { getDatabase } from "../../../../lib/db";

/**
 * GET /api/db/health - Database health check endpoint
 */
export async function GET() {
	try {
		const { db, error, isHealthy } = await getDatabase();

		if (!db || error || !isHealthy) {
			return NextResponse.json(
				{
					success: false,
					healthy: false,
					error: error ?? "Database not available",
					timestamp: new Date().toISOString(),
				},
				{ status: 503 }
			);
		}

		return NextResponse.json({
			success: true,
			healthy: true,
			message: "Database is healthy",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		// Log error for debugging
		if (typeof window === "undefined") {
			console.error("Health check failed:", error);
		}
		return NextResponse.json(
			{
				success: false,
				healthy: false,
				error: error instanceof Error ? error.message : "Unknown error",
				timestamp: new Date().toISOString(),
			},
			{ status: 500 }
		);
	}
}
