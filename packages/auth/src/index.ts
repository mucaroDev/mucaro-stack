/**
 * Auth Package
 * Complete authentication solution using Better Auth
 */

// Server exports
export { auth, createBetterAuth, type Auth } from "./server/index";

// Client exports
export { 
	createBetterAuthClient, 
	authClient, 
	createAuthClient,
	type AuthClient, 
	type BetterAuthClientOptions 
} from "./client/index";

// Hook exports
export {
	useAuth,
	useSignIn,
	useSignUp,
	useSignOut,
	useUpdateUser,
	type AuthState,
	type UseSignInReturn,
	type UseSignUpReturn,
	type UseSignOutReturn,
	type UseUpdateUserReturn
} from "./client/hooks";

// Component exports
export {
	AuthProvider,
	useAuthContext,
	useUser,
	useSession,
	useIsAuthenticated,
	SignInForm,
	SignUpForm,
	SignOutButton,
	UserProfile,
	AuthGuard,
	Protected,
	Guest,
	type AuthContextValue,
	type SignInFormProps,
	type SignUpFormProps,
	type SignOutButtonProps,
	type UserProfileProps,
	type AuthGuardProps
} from "./components/index";

// Schema exports
export {
	signInSchema,
	signUpSchema,
	updateUserSchema,
	passwordResetSchema,
	passwordResetConfirmSchema,
	emailVerificationSchema,
	changePasswordSchema,
	authSchema,
	user,
	session,
	account,
	verification,
	type SignInData,
	type SignUpData,
	type UpdateUserData,
	type PasswordResetData,
	type PasswordResetConfirmData,
	type EmailVerificationData,
	type ChangePasswordData
} from "./schema/index";

// Type exports
export type {
	BaseAuthProps
} from "./types/index";
