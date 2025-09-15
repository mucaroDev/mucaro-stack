import { auth } from "@workspace/auth/server";
import { createTodoOperations } from "@workspace/db";
import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../../../../lib/db";
import { getCurrentDatabaseUser } from "../../../../../lib/user-sync";

type RouteContext = {
	params: Promise<{ id: string }>;
};

/**
 * POST /api/todos/[id]/toggle - Toggle todo completion status
 */
export async function POST(request: NextRequest, context: RouteContext) {
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

		// Toggle todo completion
		const todoOps = createTodoOperations(db);
		const updatedTodo = await todoOps.toggleTodoCompletion(id, user.id);

		if (!updatedTodo) {
			return NextResponse.json({ error: "Todo not found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: updatedTodo,
		});
	} catch (error) {
		console.error("POST /api/todos/[id]/toggle error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
