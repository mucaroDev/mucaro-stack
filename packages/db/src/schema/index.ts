/**
 * Database schema exports
 * Centralized exports for all database schemas
 */

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
	usersRelations,
} from "./todos";
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
