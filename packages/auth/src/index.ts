/**
 * @workspace/auth
 *
 * A comprehensive authentication package built on Better Auth for the mucaro-stack monorepo.
 * Provides server-side auth configuration, client-side hooks, and unstyled components.
 *
 * @example
 * ```typescript
 * // Server setup
 * import { createAuthServer } from "@workspace/auth/server";
 * import { createDatabase } from "@workspace/db/connection";
 *
 * const db = createDatabase({ connectionString: process.env.DATABASE_URL });
 * export const auth = createAuthServer({
 *   database: db,
 *   secret: process.env.BETTER_AUTH_SECRET,
 *   baseURL: process.env.BETTER_AUTH_URL,
 * });
 *
 * // Client setup
 * import { createBetterAuthClient } from "@workspace/auth/client";
 *
 * export const authClient = createBetterAuthClient({
 *   baseURL: process.env.NEXT_PUBLIC_AUTH_URL
 * });
 *
 * // Component usage
 * import { SignInForm, AuthGuard } from "@workspace/auth/components";
 *
 * function App() {
 *   return (
 *     <AuthGuard fallback={<SignInForm authClient={authClient} />}>
 *       <Dashboard />
 *     </AuthGuard>
 *   );
 * }
 * ```
 */

export {
	useAuth,
	useAuthActions,
	useIsAuthenticated,
	useUser,
} from "./client/hooks.js";
export type {
	AuthClient,
	AuthClientConfig,
	InferAuthClient,
} from "./client/index.js";

// Client exports
export { createBetterAuthClient, useSession } from "./client/index.js";
export type {
	AuthGuardProps,
	AuthProviderProps,
	SignInFormProps,
	SignOutButtonProps,
	SignUpFormProps,
	UserProfileProps,
} from "./components/index.js";
// Component exports
export {
	AuthGuard,
	AuthProvider,
	SignInForm,
	SignOutButton,
	SignUpForm,
	UserProfile,
	withAuth,
	withAuthGuard,
} from "./components/index.js";
// Schema exports
export {
	account,
	authSchema,
	session,
	user,
	verification,
} from "./schema/index.js";
export type { AuthServer, AuthServerConfig } from "./server/index.js";
// Server exports
export { createAuthServer } from "./server/index.js";

// Type exports
export type {
	Account,
	AuthActions,
	AuthEnvVars,
	AuthState,
	AuthTables,
	PasswordChangeData,
	Session,
	SignInCredentials,
	SignUpData,
	UseAuthReturn,
	User,
	UserUpdateData,
} from "./types/index.js";
