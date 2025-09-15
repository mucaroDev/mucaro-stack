import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { users } from "./users";

/**
 * Todos table schema
 * Connected to users for personal todo management
 */
export const todos = pgTable("todos", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description"),
	completed: boolean("completed").default(false).notNull(),
	priority: text("priority", { enum: ["low", "medium", "high"] })
		.default("medium")
		.notNull(),
	dueDate: timestamp("due_date"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

/**
 * Relations
 */
export const todosRelations = relations(todos, ({ one }) => ({
	user: one(users, {
		fields: [todos.userId],
		references: [users.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	todos: many(todos),
}));

/**
 * Zod schemas for validation
 */
const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 255;
const MAX_DESCRIPTION_LENGTH = 1000;

export const insertTodoSchema = createInsertSchema(todos, {
	title: (schema) => schema.title.min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH),
	description: (schema) =>
		schema.description.max(MAX_DESCRIPTION_LENGTH).optional(),
	priority: (schema) => schema.priority.optional(),
	dueDate: (schema) => schema.dueDate.optional(),
});

export const selectTodoSchema = createSelectSchema(todos);

export const updateTodoSchema = insertTodoSchema.partial().omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});

/**
 * TypeScript types
 */
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;

/**
 * Extended types with relations
 */
export type TodoWithUser = Todo & {
	user: {
		id: string;
		name: string | null;
		email: string;
	};
};
