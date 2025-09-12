import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

/**
 * Users table schema
 * This is an example table - modify or remove as needed
 */
export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull().unique(),
	name: text("name"),
	avatarUrl: text("avatar_url"),
	emailVerified: boolean("email_verified").default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Zod schemas for validation
 */
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 100;

export const insertUserSchema = createInsertSchema(users, {
	email: (schema) => schema.email.email(),
	name: (schema) =>
		schema.name.min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH).optional(),
	avatarUrl: (schema) => schema.avatarUrl.url().optional(),
});

export const selectUserSchema = createSelectSchema(users);

export const updateUserSchema = insertUserSchema.partial().omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

/**
 * TypeScript types
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UpdateUser = z.infer<typeof updateUserSchema>;

/**
 * User relations (add as needed)
 */
// export const usersRelations = relations(users, ({ many }) => ({
//   posts: many(posts),
// }));
