import type { User } from "better-auth/types";
import type { ReactNode } from "react";
import { useUser } from "../client/hooks.js";

/**
 * Props for the UserProfile component
 */
export type UserProfileProps = {
	/**
	 * Custom class name for the container
	 */
	className?: string;

	/**
	 * Custom render function for the user profile
	 */
	children?: (user: User) => ReactNode;

	/**
	 * Content to show when user is not authenticated
	 */
	fallback?: ReactNode;

	/**
	 * Whether to show the user's email
	 * @default true
	 */
	showEmail?: boolean;

	/**
	 * Whether to show the user's avatar/image
	 * @default true
	 */
	showImage?: boolean;

	/**
	 * Default avatar URL when user has no image
	 */
	defaultAvatarUrl?: string;

	/**
	 * Alt text for the user's avatar
	 */
	avatarAlt?: string;
};

/**
 * Unstyled user profile component
 *
 * Displays the current user's profile information.
 * This component is unstyled, so you can apply your own CSS classes and styling.
 *
 * @param props - UserProfile props
 * @returns JSX element or null if not authenticated
 *
 * @example
 * ```typescript
 * import { UserProfile } from "@workspace/auth/components";
 *
 * function Header() {
 *   return (
 *     <header>
 *       <UserProfile
 *         className="user-profile"
 *         fallback={<span>Not signed in</span>}
 *       />
 *     </header>
 *   );
 * }
 *
 * // Custom render
 * function CustomUserProfile() {
 *   return (
 *     <UserProfile>
 *       {(user) => (
 *         <div className="custom-profile">
 *           <h2>Welcome, {user.name}!</h2>
 *           <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
 *         </div>
 *       )}
 *     </UserProfile>
 *   );
 * }
 * ```
 */
export function UserProfile({
	className,
	children,
	fallback = null,
	showEmail = true,
	showImage = true,
	defaultAvatarUrl = "/default-avatar.png",
	avatarAlt,
}: UserProfileProps) {
	const user = useUser();

	if (!user) {
		return <>{fallback}</>;
	}

	// If custom render function is provided, use it
	if (children) {
		return <div className={className}>{children(user)}</div>;
	}

	// Default profile display
	return (
		<div className={className} data-testid="user-profile">
			{showImage && (
				<div
					aria-label={avatarAlt || `${user.name}'s avatar`}
					data-testid="user-avatar"
					role="img"
					style={{
						backgroundImage: `url(${user.image || defaultAvatarUrl})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						width: "40px",
						height: "40px",
						borderRadius: "50%",
					}}
				/>
			)}

			<div data-testid="user-info">
				<div data-testid="user-name">{user.name}</div>

				{showEmail && <div data-testid="user-email">{user.email}</div>}

				{user.emailVerified && (
					<div data-testid="user-verified-badge">Verified</div>
				)}
			</div>
		</div>
	);
}
