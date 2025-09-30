import { db, user } from "@workspace/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * GET /api/users/[id] - Fetch a single user (from Better Auth)
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const [foundUser] = await db.select().from(user).where(eq(user.id, id));

		if (!foundUser) {
			return NextResponse.json(
				{
					success: false,
					error: "User not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			user: foundUser,
		});
	} catch (error) {
		console.error("Failed to fetch user:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

/**
 * PATCH /api/users/[id] - Not allowed, Better Auth manages user updates
 */
export async function PATCH() {
	return NextResponse.json(
		{
			success: false,
			error:
				"User updates are managed by Better Auth. Use Better Auth API endpoints.",
		},
		{ status: 405 }
	);
}

/**
 * DELETE /api/users/[id] - Not allowed, Better Auth manages user deletion
 */
export async function DELETE() {
	return NextResponse.json(
		{
			success: false,
			error:
				"User deletion is managed by Better Auth. Use Better Auth admin API.",
		},
		{ status: 405 }
	);
}
