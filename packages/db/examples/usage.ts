/**
 * Example usage of the @workspace/db package
 * This file demonstrates how to use the database package in your apps
 */

import {
	createDatabase,
	healthCheck,
	runMigrations,
	validateEnvConfig,
} from "../src/connection.js";
import { insertUserSchema, users } from "../src/schema/users.js";

/**
 * Example: Basic database setup and usage
 */
async function basicExample() {
	// Validate environment configuration
	const config = validateEnvConfig(process.env);

	// Create database connection
	const db = createDatabase(config);

	// Run migrations (typically done once at startup)
	await runMigrations(db);

	// Health check
	const isHealthy = await healthCheck(db);
	if (!isHealthy) {
		throw new Error("Database is not healthy");
	}

	// Insert a new user with validation
	const userData = insertUserSchema.parse({
		email: "john@example.com",
		name: "John Doe",
	});

	const newUser = await db.insert(users).values(userData).returning();
	console.log("Created user:", newUser[0]);

	// Query users
	const allUsers = await db.select().from(users);
	console.log("All users:", allUsers);

	// Update a user
	const updatedUser = await db
		.update(users)
		.set({ name: "John Smith" })
		.where(users.id.eq(newUser[0].id))
		.returning();

	console.log("Updated user:", updatedUser[0]);
}

/**
 * Example: App-specific database setup
 */
async function appSpecificExample() {
	// Each app can have its own database connection
	const webDb = createDatabase({
		connectionString: process.env.WEB_DATABASE_URL,
		max: 20, // Web app needs more connections
	});

	const apiDb = createDatabase({
		connectionString: process.env.API_DATABASE_URL,
		max: 10, // API needs fewer connections
	});

	// Use different databases for different purposes
	const webUsers = await webDb.select().from(users);
	const apiUsers = await apiDb.select().from(users);

	console.log("Web users:", webUsers.length);
	console.log("API users:", apiUsers.length);
}

/**
 * Example: Error handling
 */
async function errorHandlingExample() {
	try {
		const config = validateEnvConfig(process.env);
		const db = createDatabase(config);

		// This might fail if database is down
		const users = await db.select().from(users);
		console.log("Users:", users);
	} catch (error) {
		if (error instanceof Error) {
			console.error("Database error:", error.message);
		}
	}
}

// Export examples for testing
export { basicExample, appSpecificExample, errorHandlingExample };
