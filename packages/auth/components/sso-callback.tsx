import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export function SSOCallback() {
	return <AuthenticateWithRedirectCallback />;
}
