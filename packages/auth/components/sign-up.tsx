import { SignUp as ClerkSignUp } from "@clerk/nextjs";
import type { JSX } from "react";

export const SignUp = (): JSX.Element => (
	<ClerkSignUp
		appearance={{
			elements: {
				header: "hidden",
			},
		}}
	/>
);
