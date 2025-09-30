/**
 * Shared utilities for database scripts
 */

import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

/**
 * Base database configuration (without database name)
 */
export type BaseConfig = {
	host: string;
	port: number;
	user: string;
	password?: string;
	ssl: false | { rejectUnauthorized: false };
};

/**
 * Full database configuration (with database name)
 */
export type DatabaseConfig = BaseConfig & {
	database: string;
};

/**
 * Load environment variables from the most relevant .env file
 * Priority: repo root .env.local -> repo root .env -> package .env.local -> package .env
 */
export function loadEnvFiles(): void {
	const currentFile = fileURLToPath(import.meta.url);
	const packageRoot = dirname(dirname(currentFile)); // scripts/ -> package root
	const repoRoot = join(packageRoot, "..", "..");
	const candidates = [
		join(repoRoot, ".env.local"),
		join(repoRoot, ".env"),
		join(packageRoot, ".env.local"),
		join(packageRoot, ".env"),
	];

	for (const candidate of candidates) {
		if (existsSync(candidate)) {
			loadEnv({ path: candidate });
			// biome-ignore lint/suspicious/noConsole: intentional script output
			console.log(`📄 Loaded environment from: ${candidate}`);
			break;
		}
	}
}

/**
 * Parse base configuration (without database name) from environment variables
 */
export function parseBaseConfigFromEnv(): BaseConfig {
	const {
		DATABASE_URL,
		DB_HOST = "localhost",
		DB_PORT = "5432",
		DB_USER = process.env.USER || process.env.USERNAME || "postgres",
		DB_PASSWORD,
		DB_SSL = "false",
	} = process.env;

	if (DATABASE_URL) {
		try {
			const url = new URL(DATABASE_URL);
			return {
				host: url.hostname,
				port: Number.parseInt(url.port || "5432", 10),
				user: decodeURIComponent(url.username),
				password: url.password ? decodeURIComponent(url.password) : undefined,
				ssl: DB_SSL === "true" ? { rejectUnauthorized: false } : false,
			};
		} catch (error) {
			console.error("❌ Error parsing DATABASE_URL:", error);
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
 * Parse database name from environment variables
 */
export function parseDatabaseNameFromEnv(): string {
	const { DATABASE_URL, DB_NAME } = process.env;

	if (DATABASE_URL) {
		try {
			const url = new URL(DATABASE_URL);
			const pathname = url.pathname.startsWith("/")
				? url.pathname.slice(1)
				: url.pathname;
			if (!pathname || pathname.length === 0) {
				throw new Error("No database name found in DATABASE_URL");
			}
			return pathname;
		} catch (error) {
			console.error("❌ Error parsing DATABASE_URL:", error);
			process.exit(1);
		}
	}

	if (DB_NAME && DB_NAME.trim().length > 0) {
		return DB_NAME;
	}

	console.error(
		"❌ Missing database name. Set DATABASE_URL or DB_NAME in your environment."
	);
	process.exit(1);
}

/**
 * Parse full database configuration from environment variables
 */
export function parseFullConfigFromEnv(): DatabaseConfig {
	return {
		...parseBaseConfigFromEnv(),
		database: parseDatabaseNameFromEnv(),
	};
}

/**
 * Check if a database exists
 */
export async function databaseExists(
	config: BaseConfig,
	dbName: string
): Promise<boolean> {
	const client = new Client({
		...config,
		database: "postgres",
	});

	try {
		await client.connect();
		const result = await client.query(
			"SELECT 1 FROM pg_database WHERE datname = $1",
			[dbName]
		);
		return result.rows.length > 0;
	} finally {
		await client.end();
	}
}

/**
 * Create a database
 */
export async function createDatabase(
	config: BaseConfig,
	dbName: string
): Promise<void> {
	const client = new Client({
		...config,
		database: "postgres",
	});

	try {
		await client.connect();
		await client.query(`CREATE DATABASE "${dbName}"`);
	} finally {
		await client.end();
	}
}

/**
 * Drop a database
 */
export async function dropDatabase(
	config: BaseConfig,
	dbName: string
): Promise<void> {
	const client = new Client({
		...config,
		database: "postgres",
	});

	try {
		await client.connect();
		// Terminate existing connections to the database
		await client.query(
			`
			SELECT pg_terminate_backend(pg_stat_activity.pid)
			FROM pg_stat_activity
			WHERE pg_stat_activity.datname = $1
			AND pid <> pg_backend_pid()
		`,
			[dbName]
		);
		await client.query(`DROP DATABASE "${dbName}"`);
	} finally {
		await client.end();
	}
}

/**
 * Ask for user confirmation (reads from stdin)
 */
export async function askConfirmation(message: string): Promise<boolean> {
	const readline = await import("node:readline");
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(`${message} (y/N): `, (answer) => {
			rl.close();
			resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
		});
	});
}


