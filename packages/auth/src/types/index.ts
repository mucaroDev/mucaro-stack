/**
 * Type definitions for the auth package
 *
 * Re-exports types from better-auth and defines custom types
 * for the auth package components and configuration.
 */

// Re-export core Better Auth types
export type {
	Account,
	Session,
	User,
} from "better-auth/types";

// Re-export client types
export type { AuthClient, AuthClientConfig } from "../client/index.js";
// Re-export component prop types
export type {
	AuthGuardProps,
	AuthProviderProps,
	SignInFormProps,
	SignOutButtonProps,
	SignUpFormProps,
	UserProfileProps,
} from "../components/index.js";
// Re-export server types
export type { AuthServer, AuthServerConfig } from "../server/index.js";

/**
 * Authentication state
 */
export type AuthState = {
	/**
	 * Current user session
	 */
	session: Session | null;

	/**
	 * Current user
	 */
	user: User | null;

	/**
	 * Whether authentication is loading
	 */
	isLoading: boolean;

	/**
	 * Whether user is authenticated
	 */
	isAuthenticated: boolean;

	/**
	 * Authentication error, if any
	 */
	error: Error | null;
};

/**
 * Sign in credentials
 */
export type SignInCredentials = {
	/**
	 * User email
	 */
	email: string;

	/**
	 * User password
	 */
	password: string;

	/**
	 * Whether to remember the user
	 * @default false
	 */
	rememberMe?: boolean;
};

/**
 * Sign up data
 */
export type SignUpData = {
	/**
	 * User's full name
	 */
	name: string;

	/**
	 * User email
	 */
	email: string;

	/**
	 * User password
	 */
	password: string;

	/**
	 * Optional user image/avatar URL
	 */
	image?: string;
};

/**
 * User update data
 */
export type UserUpdateData = {
	/**
	 * Updated name
	 */
	name?: string;

	/**
	 * Updated image/avatar URL
	 */
	image?: string;
};

/**
 * Password change data
 */
export type PasswordChangeData = {
	/**
	 * Current password
	 */
	currentPassword: string;

	/**
	 * New password
	 */
	newPassword: string;
};

/**
 * Authentication actions interface
 */
export type AuthActions = {
	/**
	 * Sign in with email and password
	 */
	signIn: (credentials: SignInCredentials) => Promise<void>;

	/**
	 * Sign up with email and password
	 */
	signUp: (data: SignUpData) => Promise<void>;

	/**
	 * Sign out current user
	 */
	signOut: () => Promise<void>;

	/**
	 * Update user profile
	 */
	updateUser: (data: UserUpdateData) => Promise<void>;

	/**
	 * Change user password
	 */
	changePassword: (data: PasswordChangeData) => Promise<void>;

	/**
	 * Whether user is authenticated
	 */
	isAuthenticated: boolean;
};

/**
 * Auth hook return type
 */
export type UseAuthReturn = {
	/**
	 * Current session data
	 */
	data: Session | null;

	/**
	 * Whether session is loading
	 */
	isPending: boolean;

	/**
	 * Session error, if any
	 */
	error: Error | null;
};

/**
 * Database schema types for auth tables
 */
export type AuthTables = {
	user: {
		id: string;
		name: string;
		email: string;
		emailVerified: boolean;
		image: string | null;
		createdAt: Date;
		updatedAt: Date;
	};

	session: {
		id: string;
		expiresAt: Date;
		token: string;
		createdAt: Date;
		updatedAt: Date;
		ipAddress: string | null;
		userAgent: string | null;
		userId: string;
	};

	account: {
		id: string;
		accountId: string;
		providerId: string;
		userId: string;
		accessToken: string | null;
		refreshToken: string | null;
		idToken: string | null;
		accessTokenExpiresAt: Date | null;
		refreshTokenExpiresAt: Date | null;
		scope: string | null;
		password: string | null;
		createdAt: Date;
		updatedAt: Date;
	};

	verification: {
		id: string;
		identifier: string;
		value: string;
		expiresAt: Date;
		createdAt: Date;
		updatedAt: Date;
	};
};

/**
 * Environment variables required for auth
 */
export type AuthEnvVars = {
	/**
	 * Better Auth secret for signing tokens
	 */
	BETTER_AUTH_SECRET: string;

	/**
	 * Base URL for the auth server
	 */
	BETTER_AUTH_URL?: string;

	/**
	 * Database connection string
	 */
	DATABASE_URL?: string;

	/**
	 * App URL for trusted origins
	 */
	APP_URL?: string;
};
