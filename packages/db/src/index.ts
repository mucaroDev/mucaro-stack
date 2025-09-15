/**
 * @workspace/db package exports
 * Main entry point for the database package
 */

// Connection utilities
export {
	closeSingletonDatabase,
	createDatabase,
	type Database,
	type DatabaseConfig,
	getSingletonDatabase,
	healthCheck,
	validateEnvConfig,
} from "./connection";
// Migrations
export {
	type MigrationOptions,
	runMigrations,
} from "./migrations";

// Operations
export {
	createTodoOperations,
	createUserOperations,
	TodoOperations,
	UserOperations,
} from "./operations";
// Schema exports
export * from "./schema";
