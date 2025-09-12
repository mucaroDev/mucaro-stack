"use client";

import { Button } from "@workspace/ui/components/button";
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

type DatabaseStatus = {
	healthy: boolean;
	error?: string;
	loading: boolean;
};

export function DatabaseStatus() {
	const [status, setStatus] = useState<DatabaseStatus>({
		healthy: false,
		loading: true,
	});

	const checkHealth = async () => {
		setStatus((prev) => ({ ...prev, loading: true }));
		try {
			const response = await fetch("/api/db/health");
			const data = await response.json();

			setStatus({
				healthy: data.healthy,
				error: data.healthy ? undefined : data.error,
				loading: false,
			});
		} catch (error) {
			setStatus({
				healthy: false,
				error: error instanceof Error ? error.message : "Connection failed",
				loading: false,
			});
		}
	};

	useEffect(() => {
		checkHealth();
	}, []);

	return (
		<div className="rounded-lg border p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Database className="size-5" />
					<h3 className="font-semibold">Database Status</h3>
				</div>
				<Button
					disabled={status.loading}
					onClick={checkHealth}
					size="sm"
					variant="outline"
				>
					<RefreshCw
						className={`size-4 ${status.loading ? "animate-spin" : ""}`}
					/>
					Refresh
				</Button>
			</div>

			<div className="mt-3">
				{status.loading ? (
					<div className="flex items-center gap-2 text-muted-foreground">
						<RefreshCw className="size-4 animate-spin" />
						<span>Checking database connection...</span>
					</div>
				) : status.healthy ? (
					<div className="flex items-center gap-2 text-green-600">
						<CheckCircle className="size-4" />
						<span>Database is healthy and ready</span>
					</div>
				) : (
					<div className="space-y-3">
						<div className="flex items-center gap-2 text-red-600">
							<AlertCircle className="size-4" />
							<span>Database connection failed</span>
						</div>
						{status.error && (
							<div className="rounded bg-red-50 p-3 text-red-700 text-sm">
								<strong>Error:</strong> {status.error}
							</div>
						)}
						<DatabaseSetupInstructions />
					</div>
				)}
			</div>
		</div>
	);
}

function DatabaseSetupInstructions() {
	const [showInstructions, setShowInstructions] = useState(false);

	return (
		<div className="space-y-2">
			<Button
				onClick={() => setShowInstructions(!showInstructions)}
				size="sm"
				variant="outline"
			>
				{showInstructions ? "Hide" : "Show"} Setup Instructions
			</Button>

			{showInstructions && (
				<div className="rounded bg-gray-50 p-4 text-sm">
					<h4 className="mb-2 font-semibold">Database Setup Instructions:</h4>
					<ol className="list-decimal space-y-1 pl-4">
						<li>
							Install PostgreSQL:
							<code className="ml-2 rounded bg-gray-200 px-1 py-0.5">
								brew install postgresql
							</code>
						</li>
						<li>
							Start PostgreSQL:
							<code className="ml-2 rounded bg-gray-200 px-1 py-0.5">
								brew services start postgresql
							</code>
						</li>
						<li>
							Create database:
							<code className="ml-2 rounded bg-gray-200 px-1 py-0.5">
								createdb mucaro-sample
							</code>
						</li>
						<li>
							Set environment variables in{" "}
							<code className="rounded bg-gray-200 px-1 py-0.5">
								.env.local
							</code>
							:
							<pre className="mt-1 rounded bg-gray-200 p-2 text-xs">
								{`DATABASE_URL="postgresql://username:password@localhost:5432/mucaro-sample"`}
							</pre>
						</li>
						<li>
							Run migrations:
							<code className="ml-2 rounded bg-gray-200 px-1 py-0.5">
								cd packages/db && pnpm run migrate
							</code>
						</li>
						<li>
							Optional - Open Drizzle Studio:
							<code className="ml-2 rounded bg-gray-200 px-1 py-0.5">
								cd packages/db && pnpm run studio
							</code>
						</li>
					</ol>
				</div>
			)}
		</div>
	);
}
