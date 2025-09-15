import { SignIn as ClerkSignIn } from "@clerk/nextjs";
import type { JSX } from "react";

export const SignIn = (): JSX.Element => (
	<ClerkSignIn
		appearance={{
			elements: {
				header: "hidden",
			},
		}}
	/>
);
