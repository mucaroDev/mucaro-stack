"use server";

import type { User } from "@workspace/db/schema";
import { user as users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDatabase } from "./db";

// Note: This file contains legacy user CRUD operations.
// With Better Auth, users should be managed through auth sign-up/sign-in, not manual CRUD.
// These functions are kept for reference but should not be used in production.

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

		// Note: This is legacy code - Better Auth manages user creation
		// Users should be created through auth sign-up, not this function
		const userData = {
			id: crypto.randomUUID(),
			email: rawData.email,
			name: rawData.name?.trim() || "",
			emailVerified: false,
			image: rawData.avatarUrl?.trim() || null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const newUser = await db.insert(users).values(userData).returning();

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

		// Note: This is legacy code - Better Auth manages user updates
		const userData: Partial<User> = {
			email: rawData.email,
			name: rawData.name?.trim() || "",
			image: rawData.avatarUrl?.trim() || null,
			updatedAt: new Date(),
		};

		const updatedUser = await db
			.update(users)
			.set(userData)
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
