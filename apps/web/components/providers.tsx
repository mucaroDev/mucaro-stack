"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import { AuthProvider } from "@workspace/auth/components";
import { authClient } from "@/lib/auth";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="light"
			disableTransitionOnChange
			enableColorScheme
			enableSystem
		>
			<AuthProvider authClient={authClient}>{children}</AuthProvider>
		</NextThemesProvider>
	);
}
