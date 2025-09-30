import { and, eq } from "drizzle-orm";
import type { Database } from "./connection";
import type { NewTodo, Todo, UpdateTodo } from "./schema";
import { todos } from "./schema";

/**
 * Simplified todo operations - just the essentials
 */
export function createSimpleTodoOperations(db: Database) {
	return {
		/**
		 * Get all todos for a user
		 */
		async getTodos(userId: string): Promise<Todo[]> {
			return db
				.select()
				.from(todos)
				.where(eq(todos.userId, userId))
				.orderBy(todos.createdAt);
		},

		/**
		 * Create a new todo
		 */
		async createTodo(
			data: Omit<NewTodo, "id" | "createdAt" | "updatedAt">
		): Promise<Todo> {
			const [todo] = await db.insert(todos).values(data).returning();
			if (!todo) {
				throw new Error("Failed to create todo");
			}
			return todo;
		},

		/**
		 * Update a todo
		 */
		async updateTodo(
			id: string,
			userId: string,
			data: UpdateTodo
		): Promise<Todo | null> {
			const [todo] = await db
				.update(todos)
				.set({ ...data, updatedAt: new Date() })
				.where(and(eq(todos.id, id), eq(todos.userId, userId)))
				.returning();
			return todo || null;
		},

		/**
		 * Toggle todo completion
		 */
		async toggleTodo(id: string, userId: string): Promise<Todo | null> {
			// First get the current state
			const [currentTodo] = await db
				.select()
				.from(todos)
				.where(and(eq(todos.id, id), eq(todos.userId, userId)));

			if (!currentTodo) return null;

			// Toggle the completed state
			const [updatedTodo] = await db
				.update(todos)
				.set({
					completed: !currentTodo.completed,
					updatedAt: new Date(),
				})
				.where(and(eq(todos.id, id), eq(todos.userId, userId)))
				.returning();

			return updatedTodo || null;
		},

		/**
		 * Delete a todo
		 */
		async deleteTodo(id: string, userId: string): Promise<boolean> {
			const result = await db
				.delete(todos)
				.where(and(eq(todos.id, id), eq(todos.userId, userId)))
				.returning();
			return result.length > 0;
		},
	};
}

export type SimpleTodoOperations = ReturnType<
	typeof createSimpleTodoOperations
>;
