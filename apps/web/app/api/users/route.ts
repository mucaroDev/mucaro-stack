import { insertUserSchema, users } from "@workspace/db/schema";
import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/db";

/**
 * GET /api/users - Fetch all users
 */
export async function GET() {
	try {
		const { db, error, isHealthy } = await getDatabase();

		if (!(db && isHealthy)) {
			return NextResponse.json(
				{
					success: false,
					error: error || "Database not available",
					users: [],
				},
				{ status: 503 }
			);
		}

		const allUsers = await db.select().from(users).orderBy(users.createdAt);

		return NextResponse.json({
			success: true,
			users: allUsers,
			count: allUsers.length,
		});
	} catch (error) {
		// Log error for debugging
		if (typeof window === "undefined") {
			console.error("Failed to fetch users:", error);
		}
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

/**
 * POST /api/users - Create a new user
 */
export async function POST(request: Request) {
	try {
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
		const validatedData = insertUserSchema.parse(body);

		const newUser = await db.insert(users).values(validatedData).returning();

		return NextResponse.json({
			success: true,
			user: newUser[0],
			message: "User created successfully",
		});
	} catch (error) {
		console.error("Failed to create user:", error);

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
