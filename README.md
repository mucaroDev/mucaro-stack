# Mucaro Stack

A modern full-stack monorepo with Next.js, Better Auth, Drizzle ORM, PostgreSQL, and shadcn/ui.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL (running locally or accessible via connection string)
- pnpm 10+

### First Time Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mucaro-stack
   ```

2. **Set up environment variables**
   
   Create a `.env.local` file at the root with your database configuration:
   ```env
   # Option 1: Connection string (recommended)
   DATABASE_URL="postgresql://user:password@localhost:5432/your_db_name"
   
   # Option 2: Individual parameters
   DB_HOST="localhost"
   DB_PORT="5432"
   DB_USER="your_username"
   DB_PASSWORD="your_password"
   DB_NAME="your_db_name"
   DB_SSL="false"
   
   # Better Auth
   BETTER_AUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
   BETTER_AUTH_URL="http://localhost:3000"
   ```

3. **Run the setup script**
   ```bash
   pnpm setup
   ```
   
   This will:
   - Install all dependencies
   - Create the database (or ask for confirmation if it exists)
   - Run all migrations
   - Start the dev server

That's it! 🎉

## 📦 Project Structure

```
mucaro-stack/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── auth/             # Better Auth integration
│   ├── db/               # Database schema & operations
│   ├── ui/               # shadcn/ui components
│   └── typescript-config/ # Shared TypeScript configs
```

## 🛠️ Development Scripts

### Root Level Commands

```bash
# Full project setup (first time)
pnpm setup

# Start all apps in dev mode
pnpm dev

# Build all packages and apps
pnpm build

# Lint all code
pnpm lint

# Format all code
pnpm format
```

### Database Commands

```bash
# Setup/reset database (with confirmation)
pnpm db:setup

# Run migrations only
pnpm db:migrate

# Open Drizzle Studio (visual DB editor)
pnpm db:studio
```

### Package-Specific Commands

```bash
# Work on specific package
pnpm --filter @workspace/db dev
pnpm --filter web dev

# Generate database migrations after schema changes
pnpm --filter @workspace/db generate
```

## 🏗️ Tech Stack

- **Frontend**: Next.js 15+ with App Router, React 19, Tailwind CSS 4
- **Authentication**: Better Auth with OAuth, SSO, and session management
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Tooling**: Biome (formatting/linting), TypeScript, pnpm workspaces
- **Monorepo**: Turborepo

## 📚 Documentation

- [Database Package (@workspace/db)](./packages/db/README.md)
- [Auth Package (@workspace/auth)](./packages/auth/README.md)
- [Development Guidelines](./STYLING_GUIDELINES.md)

## 🎨 Adding UI Components

To add shadcn/ui components to your app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This places components in `packages/ui/src/components/`.

## 💡 Using Components

Import components from the `@workspace` packages:

```tsx
import { Button, Card } from "@workspace/ui/components";
import { useAuth } from "@workspace/auth/client";
import { db, users } from "@workspace/db";
```

## 🔒 Environment Variables

Each app can have its own `.env.local` file, or use the root `.env.local` for shared configuration.

**Required Variables:**
- `DATABASE_URL` or individual `DB_*` variables
- `BETTER_AUTH_SECRET` - Auth encryption key
- `BETTER_AUTH_URL` - Your app URL

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Better Auth Documentation](https://www.better-auth.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm format`
4. Submit a pull request

## 📝 License

MIT
