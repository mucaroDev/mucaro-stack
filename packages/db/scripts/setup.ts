#!/usr/bin/env tsx

/**
 * Database setup script
 * Creates or recreates the database from environment configuration and runs migrations
 */

import { createDatabase as createDbInstance } from "../src/connection.js";
import { runMigrations } from "../src/migrations.js";
import {
	askConfirmation,
	createDatabase,
	databaseExists,
	dropDatabase,
	loadEnvFiles,
	parseBaseConfigFromEnv,
	parseDatabaseNameFromEnv,
} from "./utils.js";

/**
 * Main setup function
 */
async function setup(): Promise<void> {
	// Load environment variables
	loadEnvFiles();

	const base = parseBaseConfigFromEnv();
	const dbName = parseDatabaseNameFromEnv();

	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log(`\n🚀 Database Setup`);
	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log(`Database: ${dbName}`);
	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log(`Host:     ${base.host}:${base.port}`);
	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log(`User:     ${base.user}`);
	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

	// Check if database exists
	const exists = await databaseExists(base, dbName);

	if (exists) {
		// biome-ignore lint/suspicious/noConsole: intentional script output
		console.log(`⚠️  Database '${dbName}' already exists.`);
		// biome-ignore lint/suspicious/noConsole: intentional script output
		console.log(
			"⚠️  This will DROP the existing database and create a fresh one."
		);
		// biome-ignore lint/suspicious/noConsole: intentional script output
		console.log("⚠️  ALL DATA WILL BE LOST!\n");

		const confirmed = await askConfirmation(
			"Are you sure you want to continue?"
		);

		if (!confirmed) {
			// biome-ignore lint/suspicious/noConsole: intentional script output
			console.log("\n❌ Setup cancelled.");
			process.exit(0);
		}

		// Drop the database
		// biome-ignore lint/suspicious/noConsole: intentional script output
		console.log(`\n🗑️  Dropping database '${dbName}'...`);
		await dropDatabase(base, dbName);
		// biome-ignore lint/suspicious/noConsole: intentional script output
		console.log("✅ Database dropped.");
	}

	// Create the database
	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log(`\n📦 Creating database '${dbName}'...`);
	await createDatabase(base, dbName);
	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log("✅ Database created.");

	// Run migrations
	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log("\n🔄 Running migrations...");

	const db = createDbInstance({
		host: base.host,
		port: base.port,
		user: base.user,
		password: base.password,
		database: dbName,
		ssl: base.ssl,
	});

	await runMigrations(db, { verbose: true });

	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log("\n✅ Database setup completed successfully!");
	// biome-ignore lint/suspicious/noConsole: intentional script output
	console.log("\n🎉 Your database is ready to use!\n");
}

// Run the setup if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	setup().catch((error) => {
		console.error("\n❌ Setup failed:", error);
		process.exit(1);
	});
}

export { setup };


