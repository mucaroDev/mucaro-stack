# @workspace/auth

A comprehensive authentication package built on [Better Auth](https://better-auth.com) for the mucaro-stack monorepo. Provides server-side auth configuration, client-side hooks, and unstyled components that integrate seamlessly with your existing database and UI components.

## Features

- 🔐 **Server-side Auth**: Pre-configured Better Auth server with Drizzle ORM adapter
- ⚛️ **React Client**: Type-safe hooks and client configuration
- 🎨 **Unstyled Components**: Authentication components without styling constraints
- 🛡️ **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🗃️ **Database Integration**: Works with your existing `@workspace/db` package
- 🔧 **Flexible Configuration**: Environment-based configuration with sensible defaults

## Installation

This package is already included in the monorepo workspace. Install dependencies:

```bash
pnpm install
```

## Quick Start

### 1. Database Setup

First, ensure your database includes the auth schema. The auth tables will be automatically created when you run migrations.

```typescript
// In your database migration or schema file
import { authSchema } from "@workspace/auth/schema";

// The schema includes: user, session, account, verification tables
```

### 2. Server Setup

Create your auth server instance:

```typescript
// lib/auth.server.ts
import { createAuthServer } from "@workspace/auth/server";
import { createDatabase } from "@workspace/db/connection";

const db = createDatabase({
  connectionString: process.env.DATABASE_URL
});

export const auth = createAuthServer({
  database: db,
  secret: process.env.BETTER_AUTH_SECRET!, // Required
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  emailVerification: {
    required: false,
    autoSignInAfterVerification: true,
  },
});
```

### 3. Client Setup

Create your auth client:

```typescript
// lib/auth.client.ts
import { createBetterAuthClient } from "@workspace/auth/client";

export const authClient = createBetterAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000"
});
```

### 4. Component Usage

Use the unstyled components in your app:

```typescript
// components/LoginForm.tsx
import { SignInForm } from "@workspace/auth/components";
import { authClient } from "@/lib/auth.client";

export function LoginForm() {
  return (
    <div className="login-container">
      <SignInForm
        authClient={authClient}
        className="space-y-4"
        onSuccess={() => router.push('/dashboard')}
        onError={(error) => toast.error(error.message)}
      />
    </div>
  );
}

// components/ProtectedPage.tsx
import { AuthGuard } from "@workspace/auth/components";
import { LoginForm } from "./LoginForm";

export function ProtectedPage({ children }) {
  return (
    <AuthGuard
      fallback={<LoginForm />}
      loading={<div>Loading...</div>}
    >
      {children}
    </AuthGuard>
  );
}
```

## API Reference

### Server

#### `createAuthServer(config)`

Creates a Better Auth server instance.

**Parameters:**
- `config.database` - Database instance from `@workspace/db`
- `config.secret` - Secret key for signing tokens (required)
- `config.baseURL` - Base URL for the application
- `config.trustedOrigins` - Array of trusted origins for CORS
- `config.session` - Session configuration options
- `config.emailVerification` - Email verification settings
- `config.rateLimit` - Rate limiting configuration

### Client

#### `createBetterAuthClient(config)`

Creates a Better Auth client instance with React hooks.

**Parameters:**
- `config.baseURL` - Base URL where your auth server is running
- `config.fetchOptions` - Additional fetch options for auth requests

#### Hooks

- `useAuth()` - Get authentication status and session data
- `useUser()` - Get the current user or null
- `useIsAuthenticated()` - Boolean authentication status
- `useAuthActions(authClient)` - Authentication action functions

### Components

All components are unstyled and accept standard HTML attributes plus auth-specific props.

#### `<SignInForm />`
Email/password sign-in form with validation and error handling.

#### `<SignUpForm />`
User registration form with password confirmation and validation.

#### `<SignOutButton />`
Button that signs out the current user with optional confirmation.

#### `<UserProfile />`
Displays current user information with customizable rendering.

#### `<AuthGuard />`
Conditionally renders content based on authentication status.

#### `<AuthProvider />`
Provides authentication context (automatically handled by Better Auth).

## Environment Variables

Required environment variables:

```env
# Required
BETTER_AUTH_SECRET=your-super-secret-key-here

# Optional (with defaults)
BETTER_AUTH_URL=http://localhost:3000
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...
```

## Database Schema

The package automatically creates these tables:

- `user` - User accounts and profile information
- `session` - Active user sessions
- `account` - OAuth provider accounts (for future social auth)
- `verification` - Email verification and password reset tokens

## Best Practices

### Security

1. **Always use HTTPS in production**
2. **Set a strong `BETTER_AUTH_SECRET`** - use a cryptographically secure random string
3. **Configure `trustedOrigins`** to match your production domains
4. **Enable rate limiting** to prevent brute force attacks

### Development

1. **Use TypeScript** - The package provides comprehensive type definitions
2. **Handle errors gracefully** - All auth actions can throw errors
3. **Customize components** - The unstyled components are designed to be styled with your design system
4. **Test authentication flows** - Components include `data-testid` attributes for testing

### Performance

1. **Use `AuthGuard`** to protect routes efficiently
2. **Leverage session caching** - Better Auth handles session caching automatically
3. **Minimize re-renders** - Use `useUser()` and `useIsAuthenticated()` for specific data needs

## Examples

### Custom Styled Sign-In Form

```typescript
import { SignInForm } from "@workspace/auth/components";
import { authClient } from "@/lib/auth.client";

export function StyledSignInForm() {
  return (
    <SignInForm
      authClient={authClient}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      onSuccess={() => router.push('/dashboard')}
      onError={(error) => {
        console.error('Sign in failed:', error);
        toast.error(error.message);
      }}
      showRememberMe={true}
      renderSignUpLink={() => (
        <Link href="/register" className="text-blue-600 hover:underline">
          Create an account
        </Link>
      )}
    />
  );
}
```

### Role-Based Access Control

```typescript
import { AuthGuard } from "@workspace/auth/components";

export function AdminPanel() {
  return (
    <AuthGuard
      canAccess={(user) => user.role === 'admin'}
      accessDeniedFallback={
        <div className="text-red-600">
          Admin access required
        </div>
      }
      fallback={<SignInForm authClient={authClient} />}
    >
      <AdminDashboard />
    </AuthGuard>
  );
}
```

### Custom User Profile

```typescript
import { UserProfile } from "@workspace/auth/components";

export function CustomUserProfile() {
  return (
    <UserProfile className="flex items-center space-x-3">
      {(user) => (
        <>
          <img 
            src={user.image || '/default-avatar.png'} 
            alt={`${user.name}'s avatar`}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
            {user.emailVerified && (
              <span className="text-xs text-green-600">✓ Verified</span>
            )}
          </div>
        </>
      )}
    </UserProfile>
  );
}
```

## Contributing

This package follows the monorepo patterns established in the workspace. When adding new features:

1. Follow the existing TypeScript patterns
2. Add comprehensive JSDoc comments
3. Include proper error handling
4. Add `data-testid` attributes to components
5. Update this README with new features

## License

Private package for the mucaro-stack monorepo.
