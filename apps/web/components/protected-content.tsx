"use client";

import { SignedIn, SignedOut, useUser } from "@workspace/auth/client";
import { Lock, Shield, User } from "lucide-react";

export function ProtectedContent() {
	const { user } = useUser();

	return (
		<>
			<SignedOut>
				<div className="rounded-lg border-2 border-gray-300 border-dashed p-6 text-center">
					<Lock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
					<h3 className="mb-2 font-medium text-gray-900 text-lg">
						Protected Content
					</h3>
					<p className="mb-4 text-gray-500">
						This content is only visible to authenticated users.
					</p>
					<div className="space-x-4">
						<a
							className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700"
							href="/sign-in"
						>
							Sign in to view
						</a>
						<a
							className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
							href="/sign-up"
						>
							Create account
						</a>
					</div>
				</div>
			</SignedOut>
			<SignedIn>
				<div className="rounded-lg border border-green-200 bg-green-50 p-6">
					<div className="flex items-start">
						<Shield className="mt-1 h-6 w-6 text-green-600" />
						<div className="ml-3">
							<h3 className="mb-2 font-medium text-green-800 text-lg">
								🎉 Welcome to Protected Content!
							</h3>
							<div className="mb-4 text-green-700">
								<p className="mb-2">
									Congratulations! You're successfully authenticated and can see
									this protected content.
								</p>
								<div className="rounded-md border border-green-200 bg-white p-4">
									<div className="mb-2 flex items-center">
										<User className="mr-2 h-4 w-4 text-green-600" />
										<span className="font-medium">User Information:</span>
									</div>
									<ul className="space-y-1 text-sm">
										<li>
											<strong>Name:</strong>{" "}
											{user?.fullName || user?.firstName || "Not provided"}
										</li>
										<li>
											<strong>Email:</strong>{" "}
											{user?.primaryEmailAddress?.emailAddress ||
												"Not provided"}
										</li>
										<li>
											<strong>ID:</strong> {user?.id}
										</li>
										<li>
											<strong>Email Verified:</strong>{" "}
											{user?.primaryEmailAddress?.verification?.status ===
											"verified"
												? "✅ Yes"
												: "❌ No"}
										</li>
									</ul>
								</div>
							</div>
							<div className="text-green-600 text-sm">
								<p>This demonstrates how authentication works with Clerk:</p>
								<ul className="mt-2 list-inside list-disc space-y-1">
									<li>Session management with Clerk</li>
									<li>Protected routes and content</li>
									<li>User data access via hooks</li>
									<li>Automatic redirect handling</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</SignedIn>
		</>
	);
}
