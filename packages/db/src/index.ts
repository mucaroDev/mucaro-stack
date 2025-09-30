/**
 * Database package exports
 * Provides database connection and schema
 */

// Export connection utilities
export {
	closeSingletonDatabase,
	createDatabase,
	type Database,
	type DatabaseConfig,
	db,
	getDefaultDatabase,
	getSingletonDatabase,
	healthCheck,
	validateEnvConfig,
} from "./connection";

// Export types (but not the Node.js-specific migration functions)
export type { MigrationOptions, MigrationStatus } from "./migrations";

// Export all schema
export * from "./schema";

// Export simple todo operations
export {
	createSimpleTodoOperations,
	type SimpleTodoOperations,
} from "./simple-todos";

// Export types
export * from "./types";
