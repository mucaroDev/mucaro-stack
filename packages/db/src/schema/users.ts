import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

/**
 * Users table schema
 * Connected to Clerk users for profile and settings storage
 */
export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	clerkId: text("clerk_id").notNull().unique(), // Clerk user ID
	email: text("email").notNull().unique(),
	name: text("name"),
	avatarUrl: text("avatar_url"),
	emailVerified: boolean("email_verified").default(false),
	// Profile settings
	darkMode: boolean("dark_mode").default(false).notNull(),
	timezone: text("timezone").default("UTC"),
	language: text("language").default("en"),
	// Timestamps
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

/**
 * Zod schemas for validation
 */
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 100;

export const insertUserSchema = createInsertSchema(users, {
	clerkId: (schema) => schema.clerkId.min(1, "Clerk ID is required"),
	email: (schema) => schema.email.email(),
	name: (schema) =>
		schema.name.min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH).optional(),
	avatarUrl: (schema) => schema.avatarUrl.url().optional(),
	timezone: (schema) => schema.timezone.optional(),
	language: (schema) => schema.language.min(2).max(5).optional(),
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
 * User relations
 */
// Note: Import relations from drizzle-orm and todos table as needed
// export const usersRelations = relations(users, ({ many }) => ({
//   todos: many(todos),
// }));
