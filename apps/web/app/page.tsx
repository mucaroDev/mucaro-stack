import { DatabaseStatus } from "../components/database-status";
import { UserManagement } from "../components/user-management";

export default function Page() {
	return (
		<div className="min-h-svh bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="mb-4 font-bold text-4xl">Database Showcase</h1>
					<p className="text-gray-600 text-lg">
						Demonstrating CRUD operations, validation, error handling, and more
						with our @workspace/db package.
					</p>
				</div>

				<div className="space-y-8">
					{/* Database Status */}
					<DatabaseStatus />

					{/* Database Features Overview */}
					<div className="rounded-lg border bg-white p-6">
						<h2 className="mb-4 font-semibold text-2xl">
							Features Demonstrated
						</h2>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							<div className="rounded border p-4">
								<h3 className="mb-2 font-semibold text-green-600">
									✅ CRUD Operations
								</h3>
								<p className="text-gray-600 text-sm">
									Create, Read, Update, Delete users with full validation
								</p>
							</div>
							<div className="rounded border p-4">
								<h3 className="mb-2 font-semibold text-green-600">
									✅ Schema Validation
								</h3>
								<p className="text-gray-600 text-sm">
									Zod schemas for type-safe data validation
								</p>
							</div>
							<div className="rounded border p-4">
								<h3 className="mb-2 font-semibold text-green-600">
									✅ Error Handling
								</h3>
								<p className="text-gray-600 text-sm">
									Graceful error handling with user-friendly messages
								</p>
							</div>
							<div className="rounded border p-4">
								<h3 className="mb-2 font-semibold text-green-600">
									✅ Connection Pooling
								</h3>
								<p className="text-gray-600 text-sm">
									Efficient database connections with health checks
								</p>
							</div>
							<div className="rounded border p-4">
								<h3 className="mb-2 font-semibold text-green-600">
									✅ Migrations
								</h3>
								<p className="text-gray-600 text-sm">
									Automatic database migrations on startup
								</p>
							</div>
							<div className="rounded border p-4">
								<h3 className="mb-2 font-semibold text-green-600">
									✅ Type Safety
								</h3>
								<p className="text-gray-600 text-sm">
									Full TypeScript support with inferred types
								</p>
							</div>
						</div>
					</div>

					{/* User Management */}
					<div className="rounded-lg border bg-white p-6">
						<UserManagement />
					</div>
				</div>
			</div>
		</div>
	);
}
