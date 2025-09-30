import { db, user } from "@workspace/db";
import { NextResponse } from "next/server";

/**
 * GET /api/users - Fetch all users (from Better Auth)
 * Note: Better Auth manages users, this is just for listing
 */
export async function GET() {
	try {
		const allUsers = await db.select().from(user).orderBy(user.createdAt);

		return NextResponse.json({
			success: true,
			users: allUsers,
			count: allUsers.length,
		});
	} catch (error) {
		console.error("Failed to fetch users:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				users: [],
			},
			{ status: 500 }
		);
	}
}
