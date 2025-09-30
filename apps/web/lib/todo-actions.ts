"use server";

import { auth } from "@workspace/auth/server";
import {
	createSimpleTodoOperations,
	db,
	insertTodoSchema,
	updateTodoSchema,
} from "@workspace/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server Actions for todo operations
 * Following Next.js best practices with proper error handling and revalidation
 */

async function requireAuth() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/auth/sign-in");
	}

	return session.user;
}

/**
 * Create a new todo
 */
export async function createTodo(formData: FormData) {
	try {
		const user = await requireAuth();
		const todoOps = createSimpleTodoOperations(db);

		const title = formData.get("title") as string;
		if (!title?.trim()) {
			throw new Error("Title is required");
		}

		// Validate with Zod
		const validatedData = insertTodoSchema.parse({
			title: title.trim(),
			userId: user.id,
		});

		await todoOps.createTodo(validatedData);

		revalidatePath("/");
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: Server-side error logging
		console.error("Failed to create todo:", error);
		throw new Error(
			error instanceof Error ? error.message : "Failed to create todo"
		);
	}
}

/**
 * Update a todo title
 */
export async function updateTodo(id: string, formData: FormData) {
	try {
		const user = await requireAuth();
		const todoOps = createSimpleTodoOperations(db);

		const title = formData.get("title") as string;
		if (!title?.trim()) {
			throw new Error("Title is required");
		}

		// Validate with Zod
		const validatedData = updateTodoSchema.parse({
			title: title.trim(),
		});

		const updated = await todoOps.updateTodo(id, user.id, validatedData);
		if (!updated) {
			throw new Error("Todo not found");
		}

		revalidatePath("/");
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: Server-side error logging
		console.error("Failed to update todo:", error);
		throw new Error(
			error instanceof Error ? error.message : "Failed to update todo"
		);
	}
}

/**
 * Toggle todo completion status
 */
export async function toggleTodo(id: string) {
	try {
		const user = await requireAuth();
		const todoOps = createSimpleTodoOperations(db);

		const updated = await todoOps.toggleTodo(id, user.id);
		if (!updated) {
			throw new Error("Todo not found");
		}

		revalidatePath("/");
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: Server-side error logging
		console.error("Failed to toggle todo:", error);
		throw new Error(
			error instanceof Error ? error.message : "Failed to toggle todo"
		);
	}
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string) {
	try {
		const user = await requireAuth();
		const todoOps = createSimpleTodoOperations(db);

		const deleted = await todoOps.deleteTodo(id, user.id);
		if (!deleted) {
			throw new Error("Todo not found");
		}

		revalidatePath("/");
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: Server-side error logging
		console.error("Failed to delete todo:", error);
		throw new Error(
			error instanceof Error ? error.message : "Failed to delete todo"
		);
	}
}
