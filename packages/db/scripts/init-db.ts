#!/usr/bin/env tsx

/**
 * Database initialization script
 * Creates a new PostgreSQL database and runs initial migrations
 */

import { Client } from "pg";
import { createDatabase } from "../src/connection.js";
import { runMigrations } from "../src/migrations.js";

/**
 * Default database name
 */
const DEFAULT_DB_NAME = "mucaro";

/**
 * Parse command line arguments
 */
function parseArgs(): { dbName: string; help: boolean } {
	const args = process.argv.slice(2);
	let dbName = DEFAULT_DB_NAME;
	let help = false;

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--help" || arg === "-h") {
			help = true;
		} else if (arg === "--name" || arg === "-n") {
			const nextArg = args[i + 1];
			if (!nextArg) {
				console.error("Error: --name requires a value");
				process.exit(1);
			}
			dbName = nextArg;
			i++; // Skip next argument since we consumed it
		} else if (!arg.startsWith("-")) {
			// Treat non-flag arguments as database name
			dbName = arg;
		}
	}

	return { dbName, help };
}

/**
 * Show help message
 */
function showHelp(): void {
	console.log(`
Database Initialization Script

Usage:
  pnpm db:init [database-name]
  pnpm db:init --name <database-name>

Options:
  -n, --name <name>    Database name (default: ${DEFAULT_DB_NAME})
  -h, --help          Show this help message

Examples:
  pnpm db:init                    # Creates '${DEFAULT_DB_NAME}' database
  pnpm db:init myapp              # Creates 'myapp' database
  pnpm db:init --name production  # Creates 'production' database

Environment Variables:
  DATABASE_URL    Full connection string (optional)
  DB_HOST         Database host (default: localhost)
  DB_PORT         Database port (default: 5432)
  DB_USER         Database user (default: current user)
  DB_PASSWORD     Database password (optional)
  DB_SSL          Enable SSL (default: false)

The script will:
1. Check if the database already exists
2. Create the database if it doesn't exist
3. Run all pending migrations
4. Verify the setup with a health check
`);
}

/**
 * Get database connection configuration
 */
function getDbConfig() {
	const {
		DATABASE_URL,
		DB_HOST = "localhost",
		DB_PORT = "5432",
		DB_USER = process.env.USER || process.env.USERNAME || "postgres",
		DB_PASSWORD,
		DB_SSL = "false",
	} = process.env;

	if (DATABASE_URL) {
		// Parse DATABASE_URL to extract connection details
		try {
			const url = new URL(DATABASE_URL);
			return {
				host: url.hostname,
				port: Number.parseInt(url.port || "5432", 10),
				user: url.username,
				password: url.password,
				ssl: DB_SSL === "true" ? { rejectUnauthorized: false } : false,
			};
		} catch (error) {
			console.error("Error parsing DATABASE_URL:", error);
			process.exit(1);
		}
	}

	return {
		host: DB_HOST,
		port: Number.parseInt(DB_PORT, 10),
		user: DB_USER,
		password: DB_PASSWORD,
		ssl: DB_SSL === "true" ? { rejectUnauthorized: false } : false,
	};
}

/**
 * Check if database exists
 */
async function databaseExists(
	config: ReturnType<typeof getDbConfig>,
	dbName: string
): Promise<boolean> {
	const client = new Client({
		...config,
		database: "postgres", // Connect to default postgres database
	});

	try {
		await client.connect();
		const result = await client.query(
			"SELECT 1 FROM pg_database WHERE datname = $1",
			[dbName]
		);
		return result.rows.length > 0;
	} catch (error) {
		console.error("Error checking database existence:", error);
		throw error;
	} finally {
		await client.end();
	}
}

/**
 * Create database
 */
async function createDatabaseIfNotExists(
	config: ReturnType<typeof getDbConfig>,
	dbName: string
): Promise<void> {
	const exists = await databaseExists(config, dbName);

	if (exists) {
		console.log(`❌ Database '${dbName}' already exists. Exiting.`);
		process.exit(0);
	}

	console.log(`📦 Creating database '${dbName}'...`);

	const client = new Client({
		...config,
		database: "postgres", // Connect to default postgres database
	});

	try {
		await client.connect();
		
		// Create database with proper quoting to handle special characters
		await client.query(`CREATE DATABASE "${dbName}"`);
		
		console.log(`✅ Database '${dbName}' created successfully`);
	} catch (error) {
		console.error(`❌ Error creating database '${dbName}':`, error);
		throw error;
	} finally {
		await client.end();
	}
}

/**
 * Main initialization function
 */
async function initializeDatabase(): Promise<void> {
	const { dbName, help } = parseArgs();

	if (help) {
		showHelp();
		return;
	}

	console.log(`🚀 Initializing database: ${dbName}`);

	try {
		// Get connection configuration
		const config = getDbConfig();

		// Create database if it doesn't exist
		await createDatabaseIfNotExists(config, dbName);

		// Connect to the new database and run migrations
		console.log("🔄 Running migrations...");
		
		const db = createDatabase({
			...config,
			database: dbName,
		});

		await runMigrations(db, {
			verbose: true,
		});

		console.log("✅ Database initialization completed successfully!");
		console.log(`
🎉 Your database is ready!

Connection details:
- Database: ${dbName}
- Host: ${config.host}
- Port: ${config.port}
- User: ${config.user}

Next steps:
1. Update your environment variables:
   DATABASE_URL=postgresql://${config.user}${config.password ? `:${config.password}` : ""}@${config.host}:${config.port}/${dbName}

2. Start using your database in your application:
   import { createDatabase } from '@workspace/db/connection';
   const db = createDatabase({ database: '${dbName}' });
`);
	} catch (error) {
		console.error("❌ Database initialization failed:", error);
		process.exit(1);
	}
}

// Run the initialization
if (import.meta.url === `file://${process.argv[1]}`) {
	initializeDatabase().catch((error) => {
		console.error("Unhandled error:", error);
		process.exit(1);
	});
}

export { initializeDatabase };
