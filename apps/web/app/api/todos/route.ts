import { auth } from "@workspace/auth/server";
import { createTodoOperations } from "@workspace/db";
import { insertTodoSchema } from "@workspace/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../../lib/db";
import { getCurrentDatabaseUser } from "../../../lib/user-sync";

/**
 * GET /api/todos - Get todos for the authenticated user
 */
export async function GET(request: NextRequest) {
	try {
		// Check authentication
		const { userId: clerkId } = await auth();
		if (!clerkId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get database connection
		const { db, error } = await getDatabase();
		if (!db || error) {
			return NextResponse.json(
				{ error: "Database connection failed" },
				{ status: 500 }
			);
		}

		// Get or create user from Clerk data
		const user = await getCurrentDatabaseUser();

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const completed = searchParams.get("completed");
		const limit = searchParams.get("limit");
		const offset = searchParams.get("offset");

		// Get todos
		const todoOps = createTodoOperations(db);
		const todos = await todoOps.getTodosByUserId(user.id, {
			completed:
				completed === "true" ? true : completed === "false" ? false : undefined,
			limit: limit ? Number.parseInt(limit, 10) : undefined,
			offset: offset ? Number.parseInt(offset, 10) : undefined,
		});

		// Get stats
		const stats = await todoOps.getTodoStats(user.id);

		return NextResponse.json({
			success: true,
			data: {
				todos,
				stats,
			},
		});
	} catch (error) {
		console.error("GET /api/todos error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

/**
 * POST /api/todos - Create a new todo
 */
export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const { userId: clerkId } = await auth();
		if (!clerkId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse request body
		const body = await request.json();

		// Validate input
		const createTodoSchema = insertTodoSchema.omit({
			id: true,
			userId: true,
			createdAt: true,
			updatedAt: true,
		});

		const validationResult = createTodoSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Invalid input",
					details: validationResult.error.errors,
				},
				{ status: 400 }
			);
		}

		// Get database connection
		const { db, error } = await getDatabase();
		if (!db || error) {
			return NextResponse.json(
				{ error: "Database connection failed" },
				{ status: 500 }
			);
		}

		// Get or create user from Clerk data
		const user = await getCurrentDatabaseUser();

		// Create todo
		const todoOps = createTodoOperations(db);
		const newTodo = await todoOps.createTodo({
			...validationResult.data,
			userId: user.id,
		});

		return NextResponse.json(
			{
				success: true,
				data: newTodo,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("POST /api/todos error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
