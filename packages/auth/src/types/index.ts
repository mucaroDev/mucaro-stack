/**
 * Authentication Types
 * TypeScript types for the auth package
 */

// Re-export client types
export type { User, Session, AuthState, UseSignInReturn, UseSignUpReturn, UseSignOutReturn, UseUpdateUserReturn } from "../client/hooks";
export type { AuthClient, BetterAuthClientOptions } from "../client/index";

// Re-export server types
export type { Auth } from "../server/index";

// Re-export component types
export type { AuthContextValue } from "../components/auth-provider";

// Form data types (re-exported from schema)
export type {
	SignInData,
	SignUpData,
	UpdateUserData,
	PasswordResetData,
	PasswordResetConfirmData,
	EmailVerificationData,
	ChangePasswordData
} from "../schema/index";

// Component prop types
export type BaseAuthProps = {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
}

// Database schema types (re-exported from db package)
export type { authUser as user, session, account, verification } from "@workspace/db/schema";
