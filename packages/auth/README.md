# @workspace/auth

A comprehensive authentication package built with Better Auth, providing server-side authentication, client-side utilities, and React components.

## Features

- **Email & Password Authentication** - Built-in support for traditional login
- **Session Management** - Secure session handling with configurable expiration
- **React Integration** - Ready-to-use React components and hooks
- **TypeScript Support** - Fully typed for better development experience
- **Database Integration** - Uses Drizzle ORM with PostgreSQL
- **Form Validation** - Built-in validation with Zod schemas
- **Security** - CSRF protection, rate limiting, and secure defaults

## Installation

This package is part of the workspace and should be installed automatically:

```bash
pnpm install
```

## Quick Start

### 1. Server Setup

Create your auth instance with database connection:

```typescript
import { createBetterAuth } from "@workspace/auth/server";
import { db } from "@workspace/db/connection";

export const auth = createBetterAuth(db);
```

### 2. Client Setup

Create an auth client for your app:

```typescript
import { createBetterAuthClient } from "@workspace/auth/client";

export const authClient = createBetterAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
});
```

### 3. React Provider

Wrap your app with the auth provider:

```tsx
import { AuthProvider } from "@workspace/auth/components";
import { authClient } from "./lib/auth";

function App({ children }) {
  return (
    <AuthProvider authClient={authClient}>
      {children}
    </AuthProvider>
  );
}
```

### 4. Use Components

Use the pre-built components:

```tsx
import { SignInForm, SignUpForm, UserProfile, Protected } from "@workspace/auth/components";

function LoginPage() {
  return (
    <SignInForm
      onSuccess={() => router.push("/dashboard")}
      onError={(error) => console.error(error)}
    />
  );
}

function Dashboard() {
  return (
    <Protected>
      <UserProfile />
    </Protected>
  );
}
```

## API Reference

### Server

- `createBetterAuth(db)` - Create auth instance with database
- `auth` - Default auth instance (requires env configuration)

### Client

- `createBetterAuthClient(options)` - Create auth client
- `authClient` - Default auth client

### Hooks

- `useAuth(client)` - Get authentication state
- `useSignIn(client)` - Sign in functionality
- `useSignUp(client)` - Sign up functionality
- `useSignOut(client)` - Sign out functionality
- `useUpdateUser(client)` - Update user profile

### Components

- `AuthProvider` - Authentication context provider
- `SignInForm` - Email/password sign in form
- `SignUpForm` - User registration form
- `SignOutButton` - Sign out button
- `UserProfile` - User profile display/edit
- `AuthGuard` - Route protection
- `Protected` - Require authentication
- `Guest` - Require no authentication

### Context Hooks

- `useAuthContext()` - Access auth context
- `useUser()` - Get current user
- `useSession()` - Get current session
- `useIsAuthenticated()` - Check auth status

## Environment Variables

```env
# Required
AUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://...

# Optional
TRUSTED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
NODE_ENV=development
```

## Database Schema

The package uses the following tables (managed by `@workspace/db`):

- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth accounts (for future social auth)
- `verification` - Email verification tokens

## Type Safety

All components and hooks are fully typed:

```typescript
import type { User, Session, AuthState } from "@workspace/auth/types";

const user: User = {
  id: "123",
  name: "John Doe",
  email: "john@example.com",
  emailVerified: true,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## Validation

Built-in Zod schemas for form validation:

```typescript
import { signUpSchema, signInSchema } from "@workspace/auth/schema";

const validatedData = signUpSchema.parse({
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePassword123",
});
```

## Security Features

- **CSRF Protection** - Automatic CSRF token validation
- **Rate Limiting** - Configurable request limits
- **Session Security** - Secure session cookies
- **Password Requirements** - Configurable password policies
- **Input Validation** - All inputs validated with Zod

## Development

```bash
# Build the package
pnpm build

# Watch for changes
pnpm dev

# Type check
pnpm check-types

# Lint and format
pnpm lint
pnpm format
```
