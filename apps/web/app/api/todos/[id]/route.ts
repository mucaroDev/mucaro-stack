import { auth } from "@workspace/auth/server";
import { createTodoOperations } from "@workspace/db";
import { updateTodoSchema } from "@workspace/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../../../lib/db";
import { getCurrentDatabaseUser } from "../../../../lib/user-sync";

type RouteContext = {
	params: Promise<{ id: string }>;
};

/**
 * GET /api/todos/[id] - Get a specific todo
 */
export async function GET(request: NextRequest, context: RouteContext) {
	try {
		// Check authentication
		const { userId: clerkId } = await auth();
		if (!clerkId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get todo ID from params
		const { id } = await context.params;
		if (!id) {
			return NextResponse.json(
				{ error: "Todo ID is required" },
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

		// Get todo
		const todoOps = createTodoOperations(db);
		const todo = await todoOps.getTodoById(id, user.id);

		if (!todo) {
			return NextResponse.json({ error: "Todo not found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: todo,
		});
	} catch (error) {
		console.error("GET /api/todos/[id] error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

/**
 * PATCH /api/todos/[id] - Update a todo
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
	try {
		// Check authentication
		const { userId: clerkId } = await auth();
		if (!clerkId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get todo ID from params
		const { id } = await context.params;
		if (!id) {
			return NextResponse.json(
				{ error: "Todo ID is required" },
				{ status: 400 }
			);
		}

		// Parse request body
		const body = await request.json();

		// Validate input
		const validationResult = updateTodoSchema.safeParse(body);
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

		// Update todo
		const todoOps = createTodoOperations(db);
		const updatedTodo = await todoOps.updateTodo(
			id,
			user.id,
			validationResult.data
		);

		if (!updatedTodo) {
			return NextResponse.json({ error: "Todo not found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: updatedTodo,
		});
	} catch (error) {
		console.error("PATCH /api/todos/[id] error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

/**
 * DELETE /api/todos/[id] - Delete a todo
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
	try {
		// Check authentication
		const { userId: clerkId } = await auth();
		if (!clerkId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get todo ID from params
		const { id } = await context.params;
		if (!id) {
			return NextResponse.json(
				{ error: "Todo ID is required" },
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

		// Delete todo
		const todoOps = createTodoOperations(db);
		const deletedTodo = await todoOps.deleteTodo(id, user.id);

		if (!deletedTodo) {
			return NextResponse.json({ error: "Todo not found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: deletedTodo,
		});
	} catch (error) {
		console.error("DELETE /api/todos/[id] error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
