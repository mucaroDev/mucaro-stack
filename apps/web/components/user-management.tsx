import { Users } from "lucide-react";
import { Suspense } from "react";
import { getUsers } from "../lib/actions";
import { UserListClient } from "./user-list-client";

/**
 * Server Component for User Management
 * Fetches data on the server and passes it to client components
 */
export async function UserManagement() {
	const result = await getUsers();

	if (!result.success) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Users className="size-6" />
						<h2 className="font-bold text-2xl">Users</h2>
					</div>
				</div>
				<div className="rounded-lg bg-red-50 p-4 text-red-700">
					<strong>Error:</strong> {result.error}
				</div>
			</div>
		);
	}

	const { users, count } = result.data || { users: [], count: 0 };

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Users className="size-6" />
					<h2 className="font-bold text-2xl">Users ({count})</h2>
				</div>
			</div>

			<Suspense fallback={<UserManagementSkeleton />}>
				<UserListClient initialUsers={users} />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for user management
 */
function UserManagementSkeleton() {
	const skeletonIds = ["skeleton-1", "skeleton-2", "skeleton-3"];

	return (
		<div className="space-y-4">
			{skeletonIds.map((id) => (
				<div className="animate-pulse rounded-lg border p-4" key={id}>
					<div className="flex items-start justify-between">
						<div className="flex items-start gap-3">
							<div className="size-12 rounded-full bg-gray-200" />
							<div className="flex-1 space-y-2">
								<div className="h-5 w-32 rounded bg-gray-200" />
								<div className="h-4 w-48 rounded bg-gray-200" />
							</div>
						</div>
						<div className="flex gap-2">
							<div className="h-8 w-8 rounded bg-gray-200" />
							<div className="h-8 w-8 rounded bg-gray-200" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
