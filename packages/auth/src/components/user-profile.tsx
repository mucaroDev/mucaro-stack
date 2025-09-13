/**
 * User Profile Component
 * Displays and allows editing of user profile information
 */

"use client";

import { useState } from "react";
import { useUpdateUser } from "../client/hooks";
import { useAuthContext } from "./auth-provider";

/**
 * User profile props
 */
export type UserProfileProps = {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	editable?: boolean;
}

/**
 * User profile component
 * Displays user information with optional editing capabilities
 */
export function UserProfile({
	onSuccess,
	onError,
	className,
	editable = true,
}: UserProfileProps) {
	const { user, authClient } = useAuthContext();
	const { updateUser, isLoading, error } = useUpdateUser(authClient);

	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || "",
		image: user?.image || "",
	});

	if (!user) {
		return (
			<div className={className}>
				<p>No user information available</p>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { data, error: updateError } = await updateUser(formData);

		if (updateError) {
			onError?.(updateError);
		} else if (data) {
			setIsEditing(false);
			onSuccess?.();
		}
	};

	const handleCancel = () => {
		setFormData({
			name: user.name || "",
			image: user.image || "",
		});
		setIsEditing(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	if (isEditing) {
		return (
			<form onSubmit={handleSubmit} className={className}>
				<div>
					<label htmlFor="name">
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						value={formData.name}
						onChange={handleInputChange}
						disabled={isLoading}
						required
					/>
				</div>

				<div>
					<label htmlFor="image">
						Profile Image URL
					</label>
					<input
						id="image"
						name="image"
						type="url"
						value={formData.image}
						onChange={handleInputChange}
						disabled={isLoading}
						placeholder="https://example.com/avatar.jpg"
					/>
				</div>

				{error && (
					<div role="alert">
						{error.message}
					</div>
				)}

				<div>
					<button
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? "Saving..." : "Save"}
					</button>
					<button
						type="button"
						onClick={handleCancel}
						disabled={isLoading}
					>
						Cancel
					</button>
				</div>
			</form>
		);
	}

	return (
		<div className={className}>
			<div>
				{user.image && (
					<div
						style={{
							backgroundImage: `url(${user.image})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							width: "64px",
							height: "64px",
							borderRadius: "50%",
						}}
						role="img"
						aria-label={`${user.name}'s profile picture`}
					/>
				)}
			</div>

			<div>
				<h3>{user.name}</h3>
				<p>{user.email}</p>
				{user.emailVerified && (
					<p>✓ Email verified</p>
				)}
			</div>

			{editable && (
				<button
					type="button"
					onClick={() => setIsEditing(true)}
				>
					Edit Profile
				</button>
			)}
		</div>
	);
}
