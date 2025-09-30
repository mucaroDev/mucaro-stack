import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { Database } from "./connection";
import { MigrationError } from "./types";

/**
 * Migration options
 */
export type MigrationOptions = {
	/**
	 * Path to migrations folder
	 * @default Automatically resolves to the db package's drizzle/migrations folder
	 */
	migrationsFolder?: string;
	/**
	 * Whether to log migration progress
	 * @default true
	 */
	verbose?: boolean;
};

/**
 * Run database migrations
 *
 * @param database - Database instance
 * @param options - Migration options
 *
 * @example
 * ```typescript
 * import { createDatabase, runMigrations } from '@workspace/db';
 *
 * const db = createDatabase({
 *   connectionString: process.env.DATABASE_URL
 * });
 *
 * await runMigrations(db);
 * ```
 */
export async function runMigrations(
	database: Database,
	options: MigrationOptions = {}
): Promise<void> {
	// Get the directory of this file and resolve path to migrations
	// Since we're importing TS source files directly, this file is in src/migrations.ts
	// We need to go up from src/ to package root, then to drizzle/migrations
	const currentFile = fileURLToPath(import.meta.url);
	const currentDir = dirname(currentFile);
	// From src/ go up to package root, then to drizzle/migrations
	const calculatedPath = join(currentDir, "..", "drizzle", "migrations");

	// Fallback: Try to find the migrations folder by looking for it in common locations
	let defaultMigrationsPath = calculatedPath;
	if (!existsSync(calculatedPath)) {
		// Try from the package root directly
		const packageRoot = join(currentDir, "..");
		const alternativePath = join(packageRoot, "drizzle", "migrations");
		if (existsSync(alternativePath)) {
			defaultMigrationsPath = alternativePath;
		}
	}
	const { migrationsFolder = defaultMigrationsPath, verbose = true } = options;

	try {
		if (verbose) {
			// biome-ignore lint/suspicious/noConsole: Logging is intentional for migrations
			console.log("Starting database migrations...");
			console.log("Migration folder path:", migrationsFolder);
		}

		await migrate(database, {
			migrationsFolder,
		});

		if (verbose) {
			// biome-ignore lint/suspicious/noConsole: Logging is intentional for migrations
			console.log("Database migrations completed successfully");
		}
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown migration error";
		throw new MigrationError(`Migration failed: ${message}`, error);
	}
}

/**
 * Migration status information
 */
export type MigrationStatus = {
	appliedMigrations: string[];
	pendingMigrations: string[];
	lastMigration: string | null;
};

/**
 * Get migration status (requires custom implementation based on your needs)
 * This is a placeholder for a more sophisticated migration status check
 *
 * @param database - Database instance
 * @returns Migration status information
 */
export async function getMigrationStatus(
	database: Database
): Promise<MigrationStatus> {
	try {
		// Query the drizzle migrations table to get status
		// This is a basic implementation - customize as needed
		const result = await database.execute(`
      SELECT name, applied_at 
      FROM __drizzle_migrations 
      ORDER BY applied_at DESC
    `);

		const appliedMigrations = result.rows.map(
			(row: unknown) => (row as { name: string }).name
		);
		const lastMigration = appliedMigrations[0] || null;

		return {
			appliedMigrations,
			pendingMigrations: [], // Would need to compare with migration files
			lastMigration,
		};
	} catch {
		// If migrations table doesn't exist, no migrations have been run
		return {
			appliedMigrations: [],
			pendingMigrations: [],
			lastMigration: null,
		};
	}
}
