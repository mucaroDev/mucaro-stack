"use client";

import type { User } from "@workspace/db/schema";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

// Email validation regex at top level
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UserFormClientProps = {
	user?: User;
	onSubmit: (userData: {
		name?: string;
		email: string;
		avatarUrl?: string;
	}) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
};

export function UserFormClient({
	user,
	onSubmit,
	onCancel,
	isLoading = false,
}: UserFormClientProps) {
	const [formData, setFormData] = useState({
		name: user?.name || "",
		email: user?.email || "",
		avatarUrl: user?.avatarUrl || "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		// Basic validation
		const newErrors: Record<string, string> = {};

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!EMAIL_REGEX.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			await onSubmit({
				name: formData.name.trim() || undefined,
				email: formData.email.trim(),
				avatarUrl: formData.avatarUrl.trim() || undefined,
			});
		} catch (error) {
			setErrors({
				submit: error instanceof Error ? error.message : "An error occurred",
			});
		}
	};

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			{/* Name Field */}
			<div>
				<label className="block font-medium text-sm" htmlFor="name">
					Name (Optional)
				</label>
				<input
					className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
					disabled={isLoading}
					id="name"
					onChange={(e) => handleChange("name", e.target.value)}
					placeholder="Enter user's name"
					type="text"
					value={formData.name}
				/>
				{errors.name && (
					<p className="mt-1 text-red-600 text-sm">{errors.name}</p>
				)}
			</div>

			{/* Email Field */}
			<div>
				<label className="block font-medium text-sm" htmlFor="email">
					Email <span className="text-red-500">*</span>
				</label>
				<input
					className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
					disabled={isLoading}
					id="email"
					onChange={(e) => handleChange("email", e.target.value)}
					placeholder="user@example.com"
					required
					type="email"
					value={formData.email}
				/>
				{errors.email && (
					<p className="mt-1 text-red-600 text-sm">{errors.email}</p>
				)}
			</div>

			{/* Avatar URL Field */}
			<div>
				<label className="block font-medium text-sm" htmlFor="avatarUrl">
					Avatar URL (Optional)
				</label>
				<input
					className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
					disabled={isLoading}
					id="avatarUrl"
					onChange={(e) => handleChange("avatarUrl", e.target.value)}
					placeholder="https://example.com/avatar.jpg"
					type="url"
					value={formData.avatarUrl}
				/>
				{errors.avatarUrl && (
					<p className="mt-1 text-red-600 text-sm">{errors.avatarUrl}</p>
				)}
			</div>

			{/* Submit Error */}
			{errors.submit && (
				<div className="rounded-md bg-red-50 p-3 text-red-700 text-sm">
					{errors.submit}
				</div>
			)}

			{/* Action Buttons */}
			<div className="flex justify-end gap-2 pt-4">
				<Button
					disabled={isLoading}
					onClick={onCancel}
					type="button"
					variant="outline"
				>
					Cancel
				</Button>
				<Button disabled={isLoading} type="submit">
					{isLoading ? (
						<div className="flex items-center gap-2">
							<div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
							{user ? "Updating..." : "Creating..."}
						</div>
					) : user ? (
						"Update User"
					) : (
						"Create User"
					)}
				</Button>
			</div>
		</form>
	);
}
