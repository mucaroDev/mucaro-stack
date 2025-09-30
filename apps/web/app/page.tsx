import { auth } from "@workspace/auth/server";
import { createSimpleTodoOperations, db } from "@workspace/db";
import { Container } from "@workspace/ui/components/container";
import { headers } from "next/headers";
import { ProtectedContent } from "@/components/protected-content";
import { SimpleTodos } from "@/components/simple-todos";

async function getTodos() {
	try {
		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return [];
		}

		const todoOps = createSimpleTodoOperations(db);
		return await todoOps.getTodos(session.user.id);
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: Server-side error logging
		console.error("Failed to fetch todos:", error);
		return [];
	}
}

export default async function Page() {
	// Check auth session
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const todos = session ? await getTodos() : [];

	return (
		<div className="py-8">
			<Container className="max-w-2xl">
				{session ? <SimpleTodos initialTodos={todos} /> : <ProtectedContent />}
			</Container>
		</div>
	);
}
