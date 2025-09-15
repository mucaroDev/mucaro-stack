"use client";

import type { User } from "@workspace/db/schema";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
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
			<div className="space-y-2">
				<Label htmlFor="name">Name (Optional)</Label>
				<Input
					disabled={isLoading}
					error={!!errors.name}
					id="name"
					onChange={(e) => handleChange("name", e.target.value)}
					placeholder="Enter user's name"
					type="text"
					value={formData.name}
				/>
				{errors.name && (
					<p className="text-sm text-destructive">{errors.name}</p>
				)}
			</div>

			{/* Email Field */}
			<div className="space-y-2">
				<Label htmlFor="email" required>Email</Label>
				<Input
					disabled={isLoading}
					error={!!errors.email}
					id="email"
					onChange={(e) => handleChange("email", e.target.value)}
					placeholder="user@example.com"
					required
					type="email"
					value={formData.email}
				/>
				{errors.email && (
					<p className="text-sm text-destructive">{errors.email}</p>
				)}
			</div>

			{/* Avatar URL Field */}
			<div className="space-y-2">
				<Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
				<Input
					disabled={isLoading}
					error={!!errors.avatarUrl}
					id="avatarUrl"
					onChange={(e) => handleChange("avatarUrl", e.target.value)}
					placeholder="https://example.com/avatar.jpg"
					type="url"
					value={formData.avatarUrl}
				/>
				{errors.avatarUrl && (
					<p className="text-sm text-destructive">{errors.avatarUrl}</p>
				)}
			</div>

			{/* Submit Error */}
			{errors.submit && (
				<Alert variant="destructive">
					<AlertDescription>{errors.submit}</AlertDescription>
				</Alert>
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
