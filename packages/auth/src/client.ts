import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

// Export commonly used hooks and methods
export const { useSession, $Infer } = authClient;

// Export the full client as default
export default authClient;
