/**
 * User utilities for Better Auth integration
 * Better Auth handles user management, so this is simplified
 */

import { auth } from "@workspace/auth/server";
import { db, type User, user as userTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * Get current user from Better Auth session
 * Better Auth already manages users in the database
 */
export async function getCurrentDatabaseUser(): Promise<User | null> {
	try {
		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return null;
		}

		// Better Auth already created the user, just fetch it
		const [dbUser] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.id, session.user.id))
			.limit(1);

		return dbUser || null;
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: Server-side error logging
		console.error("Failed to get current user:", error);
		return null;
	}
}
