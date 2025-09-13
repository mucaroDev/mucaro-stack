/**
 * Database schema exports
 * Centralized exports for all database schemas
 */

// Auth schema (from @workspace/auth)
export {
	account,
	authSchema,
	session,
	user as authUser,
	verification,
} from "./auth";
// User management schema
export {
	insertUserSchema,
	type NewUser,
	selectUserSchema,
	type UpdateUser,
	type User,
	updateUserSchema,
	users,
} from "./users";
