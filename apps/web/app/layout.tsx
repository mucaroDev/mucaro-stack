import { IBM_Plex_Mono, Lora, Plus_Jakarta_Sans } from "next/font/google";

import "@workspace/ui/globals.css";
import "./styles.css";
import NavBar from "@/components/nav-bar";
import { Providers } from "@/components/providers";

const fontSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontSerif = Lora({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-serif",
});

const fontMono = IBM_Plex_Mono({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-mono",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} font-sans antialiased`}
			>
				<Providers>
					<NavBar />
					<main className="relative">{children}</main>
				</Providers>
			</body>
		</html>
	);
}
