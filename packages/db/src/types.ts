/**
 * Common database types and utilities
 */

/**
 * Base timestamp fields that most tables should have
 */
export type TimestampFields = {
	createdAt: Date;
	updatedAt: Date;
};

/**
 * Base fields with ID and timestamps
 */
export type BaseEntity = TimestampFields & {
	id: string;
};

/**
 * Soft delete fields
 */
export type SoftDeleteFields = {
	deletedAt: Date | null;
};

/**
 * Common database error types
 */
export class DatabaseError extends Error {
	readonly code?: string;
	readonly originalError?: unknown;

	constructor(message: string, code?: string, originalError?: unknown) {
		super(message);
		this.name = "DatabaseError";
		this.code = code;
		this.originalError = originalError;
	}
}

/**
 * Connection error
 */
export class ConnectionError extends DatabaseError {
	constructor(message: string, originalError?: unknown) {
		super(message, "CONNECTION_ERROR", originalError);
		this.name = "ConnectionError";
	}
}

/**
 * Query error
 */
export class QueryError extends DatabaseError {
	constructor(message: string, originalError?: unknown) {
		super(message, "QUERY_ERROR", originalError);
		this.name = "QueryError";
	}
}

/**
 * Migration error
 */
export class MigrationError extends DatabaseError {
	constructor(message: string, originalError?: unknown) {
		super(message, "MIGRATION_ERROR", originalError);
		this.name = "MigrationError";
	}
}

/**
 * Transaction callback type
 */
export type TransactionCallback<T> = (tx: unknown) => Promise<T>;

/**
 * Database configuration environment
 */
export type Environment = "development" | "test" | "staging" | "production";

/**
 * Connection pool statistics
 */
export type PoolStats = {
	totalCount: number;
	idleCount: number;
	waitingCount: number;
};
