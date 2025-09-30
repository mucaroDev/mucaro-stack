#!/usr/bin/env tsx

/**
 * Migration script
 * Ensures the target database exists (from env) and runs all pending migrations
 */

import { createDatabase } from "../src/connection.js";
import { runMigrations } from "../src/migrations.js";
import {
	createDatabase as createDb,
	databaseExists,
	loadEnvFiles,
	parseBaseConfigFromEnv,
	parseDatabaseNameFromEnv,
} from "./utils.js";

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
	// Load environment variables
	loadEnvFiles();

	const base = parseBaseConfigFromEnv();
	const dbName = parseDatabaseNameFromEnv();

	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log(`\n🔄 Running migrations for database: ${dbName}\n`);

	// Create database if it doesn't exist
	const exists = await databaseExists(base, dbName);
	if (!exists) {
		// biome-ignore lint/suspicious/noConsole: intentional script output
		console.log(`📦 Database '${dbName}' does not exist. Creating...`);
		await createDb(base, dbName);
		// biome-ignore lint/suspicious/noConsole: intentional script output
		console.log(`✅ Database '${dbName}' created.\n`);
	}

	// Connect to target DB and run migrations
	const database = createDatabase({
		host: base.host,
		port: base.port,
		user: base.user,
		password: base.password,
		database: dbName,
		ssl: base.ssl,
	});

	await runMigrations(database, { verbose: true });

	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log("\n✅ Migrations completed successfully.\n");
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	migrate().catch((error) => {
		console.error("\n❌ Migration failed:", error);
		process.exit(1);
	});
}

export { migrate };
