/**
 * Example usage of the @workspace/db package
 * This file demonstrates how to use the database package in your apps
 */

import {
	createDatabase,
	createUserOperations,
	healthCheck,
	runMigrations,
	users,
	validateEnvConfig,
} from "../src/index.js";

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

	// Create user operations instance
	const userOps = createUserOperations(db);

	// Create a new user - ID will be auto-generated as UUID
	const newUser = await userOps.createUser({
		email: "john@example.com",
		name: "John Doe",
	});
	console.log("Created user with auto-generated UUID:", newUser);

	// Query users
	const allUsers = await db.select().from(users);
	console.log("All users:", allUsers);

	// Update a user using operations
	const updatedUser = await userOps.updateUser(newUser.id, { name: "John Smith" });
	console.log("Updated user:", updatedUser);

	// Get user by email
	const userByEmail = await userOps.getUserByEmail("john@example.com");
	console.log("User by email:", userByEmail);
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
