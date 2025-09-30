/**
 * Database schema exports
 * Centralized exports for all database schemas
 */

// Better Auth authentication schema
export {
	type Account,
	account,
	accountRelations,
	type NewAccount,
	type NewSession,
	type NewUser,
	type NewVerification,
	type Session,
	session,
	sessionRelations,
	type User,
	user,
	userRelations,
	type Verification,
	verification,
} from "./auth";

// Todo management schema
export {
	insertTodoSchema,
	type NewTodo,
	selectTodoSchema,
	type Todo,
	type TodoWithUser,
	todos,
	todosRelations,
	type UpdateTodo,
	updateTodoSchema,
} from "./todos";
