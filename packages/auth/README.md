# @workspace/auth

Better Auth integration package for the Mucaro Stack. Provides comprehensive authentication with email/password, social providers, passkeys, magic links, 2FA, and more.

## Features

- ✅ **Email & Password Authentication** - Traditional username/email login
- ✅ **Username Authentication** - Username-based login (via plugin)
- ✅ **Social Providers** - Google OAuth (easily extensible)
- ✅ **Magic Link** - Passwordless email authentication
- ✅ **Passkeys (WebAuthn)** - Modern biometric authentication
- ✅ **Email OTP** - One-time password via email
- ✅ **Two-Factor Authentication (2FA)** - TOTP-based 2FA
- ✅ **Multi-Session Support** - Multiple active sessions per user
- ✅ **Organization/Multi-Tenancy** - Full organization management
- ✅ **Admin Functionality** - User management and role-based access
- ✅ **Email Verification** - Verify user email addresses
- ✅ **Password Reset** - Secure password recovery flow
- ✅ **Rate Limiting** - Built-in protection against abuse

## Installation

This package is part of the workspace and uses:
- `better-auth` - Core authentication library
- `@workspace/db` - Database integration

## Configuration

### Environment Variables

Create a `.env.local` file in your app root:

```bash
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/mucaro
BETTER_AUTH_SECRET= # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

# Optional: Social Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: Passkey Configuration
BETTER_AUTH_PASSKEY_RP_ID=localhost # Use your domain in production

# Optional: Trusted Origins
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:3001

# Next.js Public (accessible in browser)
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### Database Setup

The auth package uses the `@workspace/db` package for database operations. Make sure to run migrations:

```bash
# Generate migrations
pnpm --filter @workspace/db drizzle-kit generate

# Apply migrations
pnpm --filter @workspace/db drizzle-kit migrate
```

## Usage

### Server-Side

#### Getting the Session

```typescript
import { auth } from "@workspace/auth/server";
import { headers } from "next/headers";

export default async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

#### API Routes

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@workspace/auth/server";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

### Client-Side

#### Using the Client

```typescript
import { authClient, useSession } from "@workspace/auth/client";

export function ClientComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return <div>Welcome, {session.user.name}!</div>;
}
```

#### Sign In

```typescript
// Email & Password
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123",
  callbackURL: "/dashboard",
});

// Social Provider
await authClient.signIn.social({
  provider: "google",
  callbackURL: "/dashboard",
});

// Magic Link
await authClient.signIn.magicLink({
  email: "user@example.com",
  callbackURL: "/dashboard",
});

// Passkey
await authClient.signIn.passkey();
```

#### Sign Up

```typescript
await authClient.signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
  callbackURL: "/dashboard",
});
```

#### Sign Out

```typescript
await authClient.signOut();
```

### Middleware (Framework-Specific)

Middleware implementation is **app-specific** and depends on your framework. Here's the recommended pattern for Next.js:

```typescript
// middleware.ts (in your Next.js app)
import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/verify-email",
  ];

  // Skip auth check for public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Optimistic redirect if no session cookie
  // Note: This is NOT a security check - validate in pages/routes
  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
```

**Important:** 
- Middleware only performs optimistic redirects based on cookie existence
- Always validate sessions in your pages/routes for actual security
- For other frameworks (Remix, SvelteKit, etc.), implement according to their middleware patterns

## Advanced Features

### Two-Factor Authentication

```typescript
// Enable 2FA
await authClient.twoFactor.enable({
  password: "user-password",
});

// Verify TOTP code
await authClient.twoFactor.verifyTOTP({
  code: "123456",
  trustDevice: true,
});

// Disable 2FA
await authClient.twoFactor.disable({
  password: "user-password",
});
```

### Organizations

```typescript
// Create organization
await authClient.organization.create({
  name: "My Company",
  slug: "my-company",
});

// List user organizations
const { data: organizations } = useListOrganizations();

// Get active organization
const { data: activeOrg } = useActiveOrganization();

// Set active organization
await authClient.organization.setActive({
  organizationId: "org-id",
});
```

### Passkeys

```typescript
// Register passkey
await authClient.passkey.register({
  name: "My Device",
});

// Sign in with passkey
await authClient.signIn.passkey();

// List user passkeys
const passkeys = await authClient.passkey.list();

// Delete passkey
await authClient.passkey.delete({
  passkeyId: "passkey-id",
});
```

### Admin Features

```typescript
// Ban user (admin only)
await authClient.admin.banUser({
  userId: "user-id",
  banReason: "Violation of terms",
  banExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
});

// Unban user
await authClient.admin.unbanUser({
  userId: "user-id",
});

// Update user role
await authClient.admin.setRole({
  userId: "user-id",
  role: "admin",
});
```

## Email Configuration

The package includes email sending hooks that need to be implemented:

```typescript
// In packages/auth/src/server.ts
emailAndPassword: {
  sendResetPassword: async ({ user, url }) => {
    // Implement your email sending logic
    // Use services like Resend, SendGrid, AWS SES, etc.
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `Click here to reset: ${url}`,
    });
  },
  sendVerificationEmail: async ({ user, url }) => {
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `Click here to verify: ${url}`,
    });
  },
}
```

## Database Schema

The package creates the following tables:
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth and credential accounts
- `verification` - Email verification tokens
- `two_factor` - TOTP secrets
- `passkey` - WebAuthn credentials
- `organization` - Organizations
- `member` - Organization memberships
- `invitation` - Organization invitations

## TypeScript

Full TypeScript support with inferred types:

```typescript
import type { Auth } from "@workspace/auth/server";
import type { User, Session } from "@workspace/db";

// Session hook provides full type safety
const { data: session } = useSession();
// session.user.email ✅ Type-safe
// session.user.invalidProp ❌ Type error
```

## Security Best Practices

1. **Always use HTTPS in production** - Set `BETTER_AUTH_URL` to `https://`
2. **Keep secrets secure** - Never commit `.env` files
3. **Enable 2FA for admin accounts** - Provide extra security
4. **Configure rate limiting** - Already enabled by default
5. **Verify email addresses** - Set `requireEmailVerification: true`
6. **Use strong passwords** - Minimum 8 characters enforced
7. **Regular security updates** - Keep dependencies updated

## Troubleshooting

### Session not persisting
- Ensure cookies are enabled
- Check that `BETTER_AUTH_URL` matches your domain
- Verify middleware configuration

### Social login not working
- Verify OAuth credentials are correct
- Check redirect URIs in provider settings
- Ensure provider is enabled in auth config

### Database connection errors
- Verify `DATABASE_URL` is correct
- Ensure database is running
- Check that migrations are applied

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT

