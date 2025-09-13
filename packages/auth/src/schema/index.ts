/**
 * Authentication Schema
 * Schema definitions and validation for auth package
 */

import { z } from "zod";

// Constants
const MAX_NAME_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

/**
 * Sign in schema
 */
export const signInSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean().optional().default(false),
	callbackURL: z.string().url().optional(),
});

/**
 * Sign up schema
 */
export const signUpSchema = z.object({
	name: z.string().min(1, "Name is required").max(MAX_NAME_LENGTH, "Name must be less than 100 characters"),
	email: z.string().email("Please enter a valid email address"),
	password: z.string()
		.min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters long")
		.max(MAX_PASSWORD_LENGTH, "Password must be less than 128 characters")
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
	image: z.string().url("Please enter a valid image URL").optional(),
	callbackURL: z.string().url().optional(),
});

/**
 * Update user schema
 */
export const updateUserSchema = z.object({
	name: z.string().min(1, "Name is required").max(MAX_NAME_LENGTH, "Name must be less than 100 characters").optional(),
	image: z.string().url("Please enter a valid image URL").optional(),
});

/**
 * Password reset schema
 */
export const passwordResetSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

/**
 * Password reset confirmation schema
 */
export const passwordResetConfirmSchema = z.object({
	token: z.string().min(1, "Reset token is required"),
	password: z.string()
		.min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters long")
		.max(MAX_PASSWORD_LENGTH, "Password must be less than 128 characters")
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

/**
 * Email verification schema
 */
export const emailVerificationSchema = z.object({
	token: z.string().min(1, "Verification token is required"),
});

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string()
		.min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters long")
		.max(MAX_PASSWORD_LENGTH, "Password must be less than 128 characters")
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

/**
 * Type exports
 */
export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>;
export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

/**
 * Re-export database schema for Better Auth
 */
export { authSchema, authUser as user, session, account, verification } from "@workspace/db/schema";