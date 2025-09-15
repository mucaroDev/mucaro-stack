/**
 * Database operations
 * Helper functions for common database operations
 */

import { and, desc, eq } from "drizzle-orm";
import type { Database } from "./connection";
import {
	insertTodoSchema,
	insertUserSchema,
	type NewTodo,
	type NewUser,
	todos,
	type UpdateTodo,
	users,
} from "./schema";

/**
 * User operations for the main users table
 */
export class UserOperations {
	private readonly db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	/**
	 * Create a new user - ID will be auto-generated as UUID
	 */
	async createUser(userData: NewUser) {
		// Validate input
		const validatedData = insertUserSchema.parse(userData);

		// Insert user - ID will be auto-generated
		const [newUser] = await this.db
			.insert(users)
			.values(validatedData)
			.returning();

		return newUser;
	}

	/**
	 * Get user by ID
	 */
	async getUserById(id: string) {
		const [user] = await this.db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1);
		return user || null;
	}

	/**
	 * Get user by email
	 */
	async getUserByEmail(email: string) {
		const [user] = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		return user || null;
	}

	/**
	 * Get user by Clerk ID
	 */
	async getUserByClerkId(clerkId: string) {
		const [user] = await this.db
			.select()
			.from(users)
			.where(eq(users.clerkId, clerkId))
			.limit(1);
		return user || null;
	}

	/**
	 * Create or update user from Clerk data
	 */
	async upsertUserFromClerk(clerkData: {
		clerkId: string;
		email: string;
		name?: string;
		avatarUrl?: string;
		emailVerified?: boolean;
	}) {
		const existingUser = await this.getUserByClerkId(clerkData.clerkId);

		if (existingUser) {
			// Update existing user
			return this.updateUser(existingUser.id, {
				email: clerkData.email,
				name: clerkData.name,
				avatarUrl: clerkData.avatarUrl,
				emailVerified: clerkData.emailVerified,
			});
		}

		// Create new user
		return this.createUser({
			clerkId: clerkData.clerkId,
			email: clerkData.email,
			name: clerkData.name,
			avatarUrl: clerkData.avatarUrl,
			emailVerified: clerkData.emailVerified,
		});
	}

	/**
	 * Update user
	 */
	async updateUser(id: string, userData: Partial<NewUser>) {
		const [updatedUser] = await this.db
			.update(users)
			.set({ ...userData, updatedAt: new Date() })
			.where(eq(users.id, id))
			.returning();

		return updatedUser || null;
	}

	/**
	 * Delete user
	 */
	async deleteUser(id: string) {
		const [deletedUser] = await this.db
			.delete(users)
			.where(eq(users.id, id))
			.returning();
		return deletedUser || null;
	}
}

/**
 * Todo operations for the todos table
 */
export class TodoOperations {
	private readonly db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	/**
	 * Create a new todo
	 */
	async createTodo(todoData: NewTodo) {
		// Validate input
		const validatedData = insertTodoSchema.parse(todoData);

		// Insert todo
		const [newTodo] = await this.db
			.insert(todos)
			.values(validatedData)
			.returning();

		return newTodo;
	}

	/**
	 * Get todos for a specific user
	 */
	getTodosByUserId(
		userId: string,
		options?: {
			completed?: boolean;
			limit?: number;
			offset?: number;
		}
	) {
		// Build the where conditions
		const conditions = [eq(todos.userId, userId)];

		if (options?.completed !== undefined) {
			conditions.push(eq(todos.completed, options.completed));
		}

		let query = this.db
			.select()
			.from(todos)
			.where(and(...conditions))
			.orderBy(desc(todos.createdAt));

		// Apply pagination
		if (options?.limit) {
			query = query.limit(options.limit);
		}
		if (options?.offset) {
			query = query.offset(options.offset);
		}

		return query;
	}

	/**
	 * Get todo by ID (with user check)
	 */
	async getTodoById(id: string, userId: string) {
		const [todo] = await this.db
			.select()
			.from(todos)
			.where(and(eq(todos.id, id), eq(todos.userId, userId)))
			.limit(1);
		return todo || null;
	}

	/**
	 * Update todo
	 */
	async updateTodo(id: string, userId: string, todoData: UpdateTodo) {
		const [updatedTodo] = await this.db
			.update(todos)
			.set({ ...todoData, updatedAt: new Date() })
			.where(and(eq(todos.id, id), eq(todos.userId, userId)))
			.returning();

		return updatedTodo || null;
	}

	/**
	 * Delete todo
	 */
	async deleteTodo(id: string, userId: string) {
		const [deletedTodo] = await this.db
			.delete(todos)
			.where(and(eq(todos.id, id), eq(todos.userId, userId)))
			.returning();
		return deletedTodo || null;
	}

	/**
	 * Toggle todo completion
	 */
	async toggleTodoCompletion(id: string, userId: string) {
		// First get the current todo
		const todo = await this.getTodoById(id, userId);
		if (!todo) {
			return null;
		}

		// Toggle completion
		return this.updateTodo(id, userId, { completed: !todo.completed });
	}

	/**
	 * Get todo statistics for a user
	 */
	async getTodoStats(userId: string) {
		const PERCENTAGE_MULTIPLIER = 100;

		const allTodos = await this.db
			.select()
			.from(todos)
			.where(eq(todos.userId, userId));

		const total = allTodos.length;
		const completed = allTodos.filter((todo) => todo.completed).length;
		const pending = total - completed;
		const highPriority = allTodos.filter(
			(todo) => todo.priority === "high" && !todo.completed
		).length;

		return {
			total,
			completed,
			pending,
			highPriority,
			completionRate:
				total > 0 ? Math.round((completed / total) * PERCENTAGE_MULTIPLIER) : 0,
		};
	}
}

/**
 * Create operations instances
 */
export function createUserOperations(db: Database) {
	return new UserOperations(db);
}

export function createTodoOperations(db: Database) {
	return new TodoOperations(db);
}
