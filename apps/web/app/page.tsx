import { AuthNav } from "../components/auth-nav";
import { DatabaseStatus } from "../components/database-status";
import { ProtectedContent } from "../components/protected-content";
import { TodoList } from "../components/todo-list";
import { UserManagement } from "../components/user-management";

export default function Page() {
	return (
		<div className="min-h-svh bg-gray-50">
			{/* Header with Auth Navigation */}
			<header className="border-b bg-white shadow-sm">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<div>
						<h1 className="font-bold text-2xl text-gray-900">Mucaro Stack</h1>
						<p className="text-gray-600 text-sm">
							Database & Authentication Showcase
						</p>
					</div>
					<AuthNav />
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="mb-4 font-bold text-4xl">Full-Stack Showcase</h1>
					<p className="text-gray-600 text-lg">
						Demonstrating CRUD operations, authentication, validation, error
						handling, and more with our @workspace/db and @workspace/auth
						packages.
					</p>
				</div>

				<div className="space-y-8">
					{/* Authentication Demo */}
					<div className="rounded-lg border bg-white p-6">
						<h2 className="mb-4 font-semibold text-2xl">
							🔐 Authentication Demo
						</h2>
						<ProtectedContent />
					</div>

					{/* Todo List - Protected Content */}
					<div className="rounded-lg border bg-white p-6">
						<h2 className="mb-6 font-semibold text-2xl">
							📋 Personal Todo List
						</h2>
						<TodoList />
					</div>

					{/* Database Status */}
					<DatabaseStatus />

					{/* Features Overview */}
					<div className="rounded-lg border bg-white p-6">
						<h2 className="mb-4 font-semibold text-2xl">
							Features Demonstrated
						</h2>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<div className="rounded border p-4">
								<h3 className="mb-2 font-semibold text-blue-600">
									🔐 Authentication
								</h3>
								<p className="text-gray-600 text-sm">
									Clerk authentication with session management and protected
									routes
								</p>
							</div>
							<div className="rounded border p-4">
								<h3 className="mb-2 font-semibold text-green-600">
									📋 Todo Management
								</h3>
								<p className="text-gray-600 text-sm">
									Personal todo list with CRUD operations, priorities, and due
									dates
								</p>
							</div>
							<div className="rounded border p-4">
								<h3 className="mb-2 font-semibold text-green-600">
									✅ CRUD Operations
								</h3>
								<p className="text-gray-600 text-sm">
									Create, Read, Update, Delete operations with full validation
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
							<div className="rounded border p-4">
								<h3 className="mb-2 font-semibold text-purple-600">
									🎨 Component Library
								</h3>
								<p className="text-gray-600 text-sm">
									Unstyled, accessible components ready for any design system
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
