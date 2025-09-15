"use client";

import type { User } from "@workspace/db/schema";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import { Plus, RefreshCw, Users } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { createUser, deleteUser, updateUser } from "../lib/actions";
import { UserCard } from "./user-card";
import { UserFormClient } from "./user-form-client";

type UserListClientProps = {
	initialUsers: User[];
};

export function UserListClient({ initialUsers }: UserListClientProps) {
	const [users, setOptimisticUsers] = useOptimistic(
		initialUsers,
		(
			state: User[],
			action: { type: "add" | "update" | "delete"; user?: User; id?: string }
		): User[] => {
			switch (action.type) {
				case "add":
					return action.user ? [action.user, ...state] : state;
				case "update": {
					if (!action.user) {
						return state;
					}
					const updatedUser = action.user;
					return state.map((u) => (u.id === updatedUser.id ? updatedUser : u));
				}
				case "delete":
					return action.id ? state.filter((u) => u.id !== action.id) : state;
				default:
					return state;
			}
		}
	);

	const [isPending, startTransition] = useTransition();
	const [showForm, setShowForm] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleCreateUser = async (userData: {
		name?: string;
		email: string;
		avatarUrl?: string;
	}) => {
		setError(null);

		// Create FormData
		const formData = new FormData();
		formData.append("email", userData.email);
		if (userData.name) {
			formData.append("name", userData.name);
		}
		if (userData.avatarUrl) {
			formData.append("avatarUrl", userData.avatarUrl);
		}

		// Optimistically add user (we don't have the full user object yet)
		const tempUser: User = {
			id: `temp-${Date.now()}`,
			email: userData.email,
			name: userData.name || null,
			avatarUrl: userData.avatarUrl || null,
			emailVerified: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		startTransition(async () => {
			setOptimisticUsers({ type: "add", user: tempUser });

			const result = await createUser(formData);

			if (result.success) {
				setShowForm(false);
				setEditingUser(null);
				// The server action will revalidate the page, so we don't need to manually update
			} else {
				setError(result.error || "Failed to create user");
				// Remove the optimistic user on error
				setOptimisticUsers({ type: "delete", id: tempUser.id });
			}
		});
	};

	const handleUpdateUser = async (userData: {
		name?: string;
		email: string;
		avatarUrl?: string;
	}) => {
		if (!editingUser) {
			return;
		}

		setError(null);

		// Create FormData
		const formData = new FormData();
		formData.append("email", userData.email);
		if (userData.name) {
			formData.append("name", userData.name);
		}
		if (userData.avatarUrl) {
			formData.append("avatarUrl", userData.avatarUrl);
		}

		// Optimistically update user
		const updatedUser: User = {
			...editingUser,
			...userData,
			name: userData.name || null,
			avatarUrl: userData.avatarUrl || null,
			updatedAt: new Date(),
		};

		startTransition(async () => {
			setOptimisticUsers({ type: "update", user: updatedUser });

			const result = await updateUser(editingUser.id, formData);

			if (result.success) {
				setShowForm(false);
				setEditingUser(null);
			} else {
				setError(result.error || "Failed to update user");
				// Revert the optimistic update on error
				setOptimisticUsers({ type: "update", user: editingUser });
			}
		});
	};

	const handleDeleteUser = async (id: string) => {
		setError(null);

		// Find the user for potential rollback
		const userToDelete = users.find((u) => u.id === id);
		if (!userToDelete) {
			return;
		}

		startTransition(async () => {
			setOptimisticUsers({ type: "delete", id });

			const result = await deleteUser(id);

			if (!result.success) {
				setError(result.error || "Failed to delete user");
				// Restore the user on error
				setOptimisticUsers({ type: "add", user: userToDelete });
			}
		});
	};

	const handleEdit = (user: User) => {
		setEditingUser(user);
		setShowForm(true);
	};

	const handleCancelForm = () => {
		setShowForm(false);
		setEditingUser(null);
		setError(null);
	};

	const handleRefresh = () => {
		// Force a page refresh to get latest data
		window.location.reload();
	};

	return (
		<div className="space-y-6">
			{/* Action Buttons */}
			<div className="flex gap-2">
				<Button disabled={isPending} onClick={handleRefresh} variant="outline">
					<RefreshCw className={`size-4 ${isPending ? "animate-spin" : ""}`} />
					Refresh
				</Button>
				<Button disabled={isPending} onClick={() => setShowForm(true)}>
					<Plus className="size-4" />
					Add User
				</Button>
			</div>

			{/* Error Display */}
			{error && (
				<Alert variant="destructive">
					<AlertDescription>
						<strong>Error:</strong> {error}
					</AlertDescription>
				</Alert>
			)}

			{/* Form Modal */}
			<Dialog open={showForm} onClose={handleCancelForm}>
				<DialogHeader>
					<DialogTitle>
						{editingUser ? "Edit User" : "Create New User"}
					</DialogTitle>
				</DialogHeader>
				<DialogContent>
					<UserFormClient
						isLoading={isPending}
						onCancel={handleCancelForm}
						onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
						user={editingUser || undefined}
					/>
				</DialogContent>
			</Dialog>

			{/* Users List */}
			{users.length === 0 ? (
				<div className="py-8 text-center text-gray-500">
					<Users className="mx-auto mb-2 size-12 opacity-50" />
					<p>No users found</p>
					<p className="text-sm">Create your first user to get started</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4">
					{users.map((user) => (
						<UserCard
							isDeleting={isPending}
							key={user.id}
							onDelete={handleDeleteUser}
							onEdit={handleEdit}
							user={user}
						/>
					))}
				</div>
			)}

			{/* Loading overlay */}
			{isPending && (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-20">
					<div className="rounded-lg bg-white p-4 shadow-lg">
						<div className="flex items-center gap-2">
							<RefreshCw className="size-4 animate-spin" />
							<span>Processing...</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
