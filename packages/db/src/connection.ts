import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import { users } from "./schema/users";

/**
 * Schema object for type inference
 * Add new schemas here as you create them
 */
const schema = { users } as const;

/**
 * Configuration options for database connection
 */
export type DatabaseConfig = PoolConfig & {
	/**
	 * Database connection string (alternative to individual config options)
	 */
	connectionString?: string;
	/**
	 * Maximum number of connections in the pool
	 * @default 20
	 */
	max?: number;
	/**
	 * Minimum number of connections in the pool
	 * @default 0
	 */
	min?: number;
	/**
	 * Connection timeout in milliseconds
	 * @default 30000
	 */
	connectionTimeoutMillis?: number;
	/**
	 * Idle timeout in milliseconds
	 * @default 10000
	 */
	idleTimeoutMillis?: number;
};

/**
 * Database instance type with schema
 */
export type Database = NodePgDatabase<typeof schema>;

/**
 * Connection pool instance
 */
let pool: Pool | null = null;

/**
 * Database instance
 */
let db: Database | null = null;

/**
 * Default connection timeout in milliseconds
 */
const DEFAULT_CONNECTION_TIMEOUT = 30_000;

/**
 * Default idle timeout in milliseconds
 */
const DEFAULT_IDLE_TIMEOUT = 10_000;

/**
 * Default maximum connections
 */
const DEFAULT_MAX_CONNECTIONS = 20;

/**
 * Creates a new database connection factory
 * Each app can call this with their own configuration
 *
 * @param config - Database configuration options
 * @returns Database instance with schema
 *
 * @example
 * ```typescript
 * // Using connection string
 * const db = createDatabase({
 *   connectionString: process.env.DATABASE_URL
 * });
 *
 * // Using individual options
 * const db = createDatabase({
 *   host: process.env.DB_HOST,
 *   port: Number(process.env.DB_PORT),
 *   user: process.env.DB_USER,
 *   password: process.env.DB_PASSWORD,
 *   database: process.env.DB_NAME,
 *   ssl: process.env.NODE_ENV === 'production'
 * });
 * ```
 */
export function createDatabase(config: DatabaseConfig): Database {
	// Create a new pool for this database instance
	const newPool = new Pool({
		max: DEFAULT_MAX_CONNECTIONS,
		min: 0,
		connectionTimeoutMillis: DEFAULT_CONNECTION_TIMEOUT,
		idleTimeoutMillis: DEFAULT_IDLE_TIMEOUT,
		...config,
	});

	// Create drizzle instance with schema
	return drizzle({
		client: newPool,
		schema,
	});
}

/**
 * Creates a singleton database connection
 * Useful for apps that only need one database connection
 *
 * @param config - Database configuration options
 * @returns Database instance with schema
 *
 * @example
 * ```typescript
 * // First call creates the connection
 * const db1 = getSingletonDatabase({
 *   connectionString: process.env.DATABASE_URL
 * });
 *
 * // Subsequent calls return the same instance
 * const db2 = getSingletonDatabase(); // Returns db1
 * ```
 */
export function getSingletonDatabase(config?: DatabaseConfig): Database {
	if (!db) {
		if (!config) {
			throw new Error(
				"Database configuration is required for first initialization"
			);
		}

		pool = new Pool({
			max: DEFAULT_MAX_CONNECTIONS,
			min: 0,
			connectionTimeoutMillis: DEFAULT_CONNECTION_TIMEOUT,
			idleTimeoutMillis: DEFAULT_IDLE_TIMEOUT,
			...config,
		});

		db = drizzle({
			client: pool,
			schema,
		});
	}

	return db;
}

/**
 * Closes the singleton database connection
 * Should be called when shutting down the application
 */
export async function closeSingletonDatabase(): Promise<void> {
	if (pool) {
		await pool.end();
		pool = null;
		db = null;
	}
}

/**
 * Health check for database connection
 *
 * @param database - Database instance to check
 * @returns Promise that resolves to true if connection is healthy
 */
export async function healthCheck(database: Database): Promise<boolean> {
	try {
		await database.execute("SELECT 1");
		return true;
	} catch {
		return false;
	}
}

/**
 * Type-safe environment variable helper
 * Ensures required database environment variables are present
 *
 * @param env - Environment variables object (e.g., process.env)
 * @returns Validated database configuration
 *
 * @example
 * ```typescript
 * const config = validateEnvConfig(process.env);
 * const db = createDatabase(config);
 * ```
 */
export function validateEnvConfig(
	env: Record<string, string | undefined>
): DatabaseConfig {
	const {
		DATABASE_URL,
		DB_HOST,
		DB_PORT,
		DB_USER,
		DB_PASSWORD,
		DB_NAME,
		DB_SSL,
	} = env;

	// If DATABASE_URL is provided, use it
	if (DATABASE_URL) {
		return {
			connectionString: DATABASE_URL,
			ssl: DB_SSL === "true" ? { rejectUnauthorized: false } : false,
		};
	}

	// Otherwise, validate individual connection parameters
	const requiredVars = [DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME];
	if (requiredVars.some((v) => !v)) {
		throw new Error(
			"Missing required database environment variables. " +
				"Provide either DATABASE_URL or all of: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME"
		);
	}

	// At this point, we know all variables are defined due to the check above
	return {
		host: DB_HOST as string,
		port: Number.parseInt(DB_PORT as string, 10),
		user: DB_USER as string,
		password: DB_PASSWORD as string,
		database: DB_NAME as string,
		ssl: DB_SSL === "true" ? { rejectUnauthorized: false } : false,
	};
}
