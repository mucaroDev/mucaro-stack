/**
 * Database utilities for the web app
 * Provides connection management and error handling
 */

import {
	createDatabase,
	type Database,
	healthCheck,
	validateEnvConfig,
} from "@workspace/db/connection";
import { runMigrations } from "@workspace/db/migrations";

let db: Database | null = null;
let dbError: string | null = null;

/**
 * Get database instance with error handling
 */
export async function getDatabase(): Promise<{
	db: Database | null;
	error: string | null;
	isHealthy: boolean;
}> {
	// Return cached error if we already failed
	if (dbError && !db) {
		return { db: null, error: dbError, isHealthy: false };
	}

	// Return cached connection if available
	if (db) {
		try {
			const isHealthy = await healthCheck(db);
			return { db, error: null, isHealthy };
		} catch (error) {
			dbError = `Health check failed: ${error instanceof Error ? error.message : "Unknown error"}`;
			return { db: null, error: dbError, isHealthy: false };
		}
	}

	// Try to create new connection
	try {
		const config = validateEnvConfig(process.env);
		db = createDatabase(config);

		// Run migrations on first connection
		await runMigrations(db);

		// Verify connection health
		const isHealthy = await healthCheck(db);
		if (!isHealthy) {
			throw new Error("Database health check failed");
		}

		dbError = null;
		return { db, error: null, isHealthy: true };
	} catch (error) {
		dbError = error instanceof Error ? error.message : "Unknown database error";
		db = null;
		return { db: null, error: dbError, isHealthy: false };
	}
}

/**
 * Database setup instructions for development
 */
export const DB_SETUP_INSTRUCTIONS = `
To set up the database:

1. Install PostgreSQL:
   brew install postgresql
   # or
   sudo apt-get install postgresql

2. Start PostgreSQL service:
   brew services start postgresql
   # or
   sudo systemctl start postgresql

3. Create a database:
   createdb mucaro-sample

4. Set environment variables in .env.local:
   DATABASE_URL="postgresql://username:password@localhost:5432/mucaro-sample"
   # or
   DATABASE_HOST="localhost"
   DATABASE_PORT="5432"
   DATABASE_NAME="mucaro-sample"
   DATABASE_USER="your_username"
   DATABASE_PASSWORD="your_password"

5. Run migrations:
   cd packages/db && pnpm run migrate

6. (Optional) Open Drizzle Studio to view your data:
   cd packages/db && pnpm run studio
`;

/**
 * Reset database connection (useful for development)
 */
export function resetDatabaseConnection(): void {
	db = null;
	dbError = null;
}
