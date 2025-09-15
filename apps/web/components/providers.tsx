"use client";

import { AuthProvider } from "@workspace/auth/provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="light"
			disableTransitionOnChange
			enableColorScheme
			enableSystem
		>
			<AuthProvider>{children}</AuthProvider>
		</NextThemesProvider>
	);
}
