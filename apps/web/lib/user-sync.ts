/**
 * User synchronization utilities for Clerk integration
 * Handles syncing Clerk user data with our database
 */

import { currentUser } from "@workspace/auth/server";
import { createUserOperations } from "@workspace/db";
import { getDatabase } from "./db";

/**
 * Sync current Clerk user with database
 * Creates or updates user record based on Clerk data
 */
export async function syncCurrentUser() {
	try {
		// Get current Clerk user
		const clerkUser = await currentUser();
		if (!clerkUser) {
			return { success: false, error: "No authenticated user found" };
		}

		// Get database connection
		const { db, error: dbError } = await getDatabase();
		if (!db || dbError) {
			return { success: false, error: "Database connection failed" };
		}

		// Sync user data
		const userOps = createUserOperations(db);
		const user = await userOps.upsertUserFromClerk({
			clerkId: clerkUser.id,
			email: clerkUser.emailAddresses[0]?.emailAddress || "",
			name: clerkUser.fullName || clerkUser.firstName || "User",
			avatarUrl: clerkUser.imageUrl,
			emailVerified:
				clerkUser.emailAddresses[0]?.verification?.status === "verified",
		});

		return { success: true, user };
	} catch (error) {
		console.error("User sync error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "User sync failed",
		};
	}
}

/**
 * Get or create user for the current Clerk session
 * Used by API routes to ensure user exists in database
 */
export async function getCurrentDatabaseUser() {
	const syncResult = await syncCurrentUser();

	if (!syncResult.success) {
		throw new Error(syncResult.error);
	}

	return syncResult.user;
}
