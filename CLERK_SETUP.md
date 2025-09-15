# Clerk Authentication Environment Variables

You need to set up the following environment variables for Clerk authentication:

## Required Environment Variables:

### For Development (.env.local):
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
CLERK_SECRET_KEY=sk_test_your-secret-key-here

### Optional (with defaults):
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

### For proper SSO and OAuth redirects:
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

### For Webhooks (optional):
CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret-here

## How to get your Clerk keys:

1. Go to https://dashboard.clerk.com/
2. Create a new application or select an existing one
3. Go to 'API Keys' in the sidebar
4. Copy your Publishable key and Secret key
5. Create a .env.local file in apps/web/ with the keys above

## Database Configuration:
DATABASE_URL=postgresql://user:password@localhost:5432/mucaro

# Alternative database configuration (if not using DATABASE_URL)
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=user
# DB_PASSWORD=password
# DB_NAME=mucaro
# DB_SSL=false

## Note: 
- .env.local files are gitignored by default
- Never commit real API keys to version control
- The build will fail without these environment variables
