"use client";

import type { User } from "@workspace/db/schema";
import { Button } from "@workspace/ui/components/button";
import { Edit, Mail, Trash2, User as UserIcon } from "lucide-react";
import { useState } from "react";

type UserCardProps = {
	user: User;
	onEdit: (user: User) => void;
	onDelete: (id: string) => Promise<void>;
	isDeleting?: boolean;
};

export function UserCard({
	user,
	onEdit,
	onDelete,
	isDeleting,
}: UserCardProps) {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const handleDelete = async () => {
		await onDelete(user.id);
		setShowDeleteConfirm(false);
	};

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="rounded-lg border p-4 transition-shadow hover:shadow-md">
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-3">
					{user.avatarUrl ? (
						<img
							alt={`${user.name || user.email}'s avatar`}
							className="size-12 rounded-full object-cover"
							src={user.avatarUrl}
						/>
					) : (
						<div className="flex size-12 items-center justify-center rounded-full bg-gray-200">
							<UserIcon className="size-6 text-gray-500" />
						</div>
					)}
					<div className="flex-1">
						<h3 className="font-semibold text-lg">
							{user.name || "Unnamed User"}
						</h3>
						<div className="flex items-center gap-1 text-gray-600">
							<Mail className="size-4" />
							<span className="text-sm">{user.email}</span>
						</div>
						{user.emailVerified && (
							<span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-1 text-green-700 text-xs">
								Verified
							</span>
						)}
					</div>
				</div>

				<div className="flex gap-2">
					<Button
						disabled={isDeleting}
						onClick={() => onEdit(user)}
						size="sm"
						variant="outline"
					>
						<Edit className="size-4" />
					</Button>
					<Button
						className="hover:bg-red-50 hover:text-red-600"
						disabled={isDeleting}
						onClick={() => setShowDeleteConfirm(true)}
						size="sm"
						variant="outline"
					>
						<Trash2 className="size-4" />
					</Button>
				</div>
			</div>

			<div className="mt-3 text-gray-500 text-xs">
				<div>Created: {formatDate(user.createdAt)}</div>
				<div>Updated: {formatDate(user.updatedAt)}</div>
				<div className="mt-1 inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs">
					ID: {user.id}
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
						<h3 className="mb-2 font-semibold text-lg">Delete User</h3>
						<p className="mb-4 text-gray-600">
							Are you sure you want to delete{" "}
							<strong>{user.name || user.email}</strong>? This action cannot be
							undone.
						</p>
						<div className="flex justify-end gap-2">
							<Button
								disabled={isDeleting}
								onClick={() => setShowDeleteConfirm(false)}
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								className="bg-red-600 hover:bg-red-700"
								disabled={isDeleting}
								onClick={handleDelete}
							>
								{isDeleting ? (
									<div className="flex items-center gap-2">
										<div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
										Deleting...
									</div>
								) : (
									"Delete"
								)}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
