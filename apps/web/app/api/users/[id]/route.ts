import { updateUserSchema, users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDatabase } from "../../../../lib/db";

/**
 * GET /api/users/[id] - Fetch a single user
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const { db, error, isHealthy } = await getDatabase();

		if (!(db && isHealthy)) {
			return NextResponse.json(
				{
					success: false,
					error: error || "Database not available",
				},
				{ status: 503 }
			);
		}

		const user = await db.select().from(users).where(eq(users.id, id));

		if (user.length === 0) {
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
			user: user[0],
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
 * PATCH /api/users/[id] - Update a user
 */
export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const { db, error, isHealthy } = await getDatabase();

		if (!(db && isHealthy)) {
			return NextResponse.json(
				{
					success: false,
					error: error || "Database not available",
				},
				{ status: 503 }
			);
		}

		const body = await request.json();

		// Validate input with Zod
		const validatedData = updateUserSchema.parse(body);

		// Add updatedAt timestamp
		const updateData = {
			...validatedData,
			updatedAt: new Date(),
		};

		const updatedUser = await db
			.update(users)
			.set(updateData)
			.where(eq(users.id, id))
			.returning();

		if (updatedUser.length === 0) {
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
			user: updatedUser[0],
			message: "User updated successfully",
		});
	} catch (error) {
		console.error("Failed to update user:", error);

		// Handle Zod validation errors
		if (error && typeof error === "object" && "issues" in error) {
			return NextResponse.json(
				{
					success: false,
					error: "Validation error",
					details: error.issues,
				},
				{ status: 400 }
			);
		}

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
 * DELETE /api/users/[id] - Delete a user
 */
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const { db, error, isHealthy } = await getDatabase();

		if (!(db && isHealthy)) {
			return NextResponse.json(
				{
					success: false,
					error: error || "Database not available",
				},
				{ status: 503 }
			);
		}

		const deletedUser = await db
			.delete(users)
			.where(eq(users.id, id))
			.returning();

		if (deletedUser.length === 0) {
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
			user: deletedUser[0],
			message: "User deleted successfully",
		});
	} catch (error) {
		console.error("Failed to delete user:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
