import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "./auth";

/**
 * Simplified todos table schema
 * Just title, completed status, and basic metadata
 */
export const todos = pgTable("todos", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	completed: boolean("completed").default(false).notNull(),
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
	user: one(user, {
		fields: [todos.userId],
		references: [user.id],
	}),
}));

/**
 * Zod schemas for validation
 */
const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 255;

export const insertTodoSchema = createInsertSchema(todos, {
	title: (schema) => schema.title.min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH),
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
		name: string;
		email: string;
	};
};
