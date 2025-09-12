"use server";

import { insertUserSchema, type User, users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDatabase } from "./db";

export type ActionResult<T = unknown> = {
	success: boolean;
	error?: string;
	data?: T;
};

/**
 * Server action to fetch all users
 */
export async function getUsers(): Promise<
	ActionResult<{ users: User[]; count: number }>
> {
	try {
		const { db, error, isHealthy } = await getDatabase();

		if (!(db && isHealthy)) {
			return {
				success: false,
				error: error || "Database not available",
			};
		}

		const allUsers = await db.select().from(users).orderBy(users.createdAt);

		return {
			success: true,
			data: {
				users: allUsers,
				count: allUsers.length,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Server action to create a new user
 */
export async function createUser(
	formData: FormData
): Promise<ActionResult<User>> {
	try {
		const { db, error, isHealthy } = await getDatabase();

		if (!(db && isHealthy)) {
			return {
				success: false,
				error: error || "Database not available",
			};
		}

		// Extract data from FormData
		const rawData = {
			name: formData.get("name") as string | null,
			email: formData.get("email") as string,
			avatarUrl: formData.get("avatarUrl") as string | null,
		};

		// Create clean data object
		const userData: Record<string, string> = {
			email: rawData.email,
		};

		if (rawData.name?.trim()) {
			userData.name = rawData.name.trim();
		}
		if (rawData.avatarUrl?.trim()) {
			userData.avatarUrl = rawData.avatarUrl.trim();
		}

		// Validate input with Zod
		const validatedData = insertUserSchema.parse(userData);

		const newUser = await db.insert(users).values(validatedData).returning();

		// Revalidate the page to show updated data
		revalidatePath("/");

		return {
			success: true,
			data: newUser[0],
		};
	} catch (error) {
		// Handle Zod validation errors
		if (error && typeof error === "object" && "issues" in error) {
			return {
				success: false,
				error: "Validation error",
			};
		}

		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Server action to update a user
 */
export async function updateUser(
	id: string,
	formData: FormData
): Promise<ActionResult<User>> {
	try {
		const { db, error, isHealthy } = await getDatabase();

		if (!(db && isHealthy)) {
			return {
				success: false,
				error: error || "Database not available",
			};
		}

		// Extract data from FormData
		const rawData = {
			name: formData.get("name") as string | null,
			email: formData.get("email") as string,
			avatarUrl: formData.get("avatarUrl") as string | null,
		};

		// Create clean data object
		const userData: Record<string, string> = {
			email: rawData.email,
		};

		if (rawData.name?.trim()) {
			userData.name = rawData.name.trim();
		}
		if (rawData.avatarUrl?.trim()) {
			userData.avatarUrl = rawData.avatarUrl.trim();
		}

		// Validate input with Zod (partial update)
		const validatedData = insertUserSchema.partial().parse(userData);

		const updatedUser = await db
			.update(users)
			.set(validatedData)
			.where(eq(users.id, id))
			.returning();

		if (updatedUser.length === 0) {
			return {
				success: false,
				error: "User not found",
			};
		}

		// Revalidate the page to show updated data
		revalidatePath("/");

		return {
			success: true,
			data: updatedUser[0],
		};
	} catch (error) {
		// Handle Zod validation errors
		if (error && typeof error === "object" && "issues" in error) {
			return {
				success: false,
				error: "Validation error",
			};
		}

		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Server action to delete a user
 */
export async function deleteUser(id: string): Promise<ActionResult> {
	try {
		const { db, error, isHealthy } = await getDatabase();

		if (!(db && isHealthy)) {
			return {
				success: false,
				error: error || "Database not available",
			};
		}

		const deletedUser = await db
			.delete(users)
			.where(eq(users.id, id))
			.returning();

		if (deletedUser.length === 0) {
			return {
				success: false,
				error: "User not found",
			};
		}

		// Revalidate the page to show updated data
		revalidatePath("/");

		return {
			success: true,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
