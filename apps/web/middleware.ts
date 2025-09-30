import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Next.js middleware for Better Auth
 * Uses the minimal recommended pattern - only checks session cookie for optimistic redirects
 * Actual auth validation happens in individual pages/routes for security
 */
export function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const { pathname } = request.nextUrl;

	// Public routes that don't require authentication
	const publicRoutes = [
		"/",
		"/auth/sign-in",
		"/auth/sign-up",
		"/auth/verify-email",
		"/auth/reset-password",
		"/auth/two-factor",
		"/api/health",
	];

	// Skip auth check for public routes and Next.js internals
	if (
		pathname.startsWith("/api/auth") ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/favicon.ico") ||
		publicRoutes.some((route) => pathname.startsWith(route))
	) {
		return NextResponse.next();
	}

	// Optimistic redirect if no session cookie exists
	// Note: This is NOT a security check - handle auth validation in pages/routes
	if (!sessionCookie) {
		const url = request.nextUrl.clone();
		url.pathname = "/auth/sign-in";
		url.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
