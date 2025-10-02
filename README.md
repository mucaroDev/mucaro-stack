# Mucaro Stack

A modern full-stack monorepo with Next.js 15, Better Auth, Drizzle ORM, PostgreSQL, and shadcn/ui components.

## 🚀 Quick Start

### Prerequisites

Choose one setup method:

**Option 1: Docker (Recommended)**
- [OrbStack](https://orbstack.dev/) (recommended for macOS) or [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Option 2: Local Development**
- Node.js 20+
- PostgreSQL database
- pnpm 10+

### Setup with Docker

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start services (Next.js + PostgreSQL)
docker compose up -d

# 3. Open the app
open http://localhost:3000
```

**Makefile shortcuts:**
```bash
make up          # Start services
make down        # Stop services
make logs        # View logs
make shell       # Web container shell
make db-shell    # PostgreSQL shell
```

### Setup Locally

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# 3. Setup database and start dev server
pnpm setup
```

That's it! The app is running at http://localhost:3000 🎉

## 📁 Project Structure

```
mucaro-stack/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── auth/             # @workspace/auth - Better Auth integration
│   ├── db/               # @workspace/db - Database schema & Drizzle ORM
│   ├── ui/               # @workspace/ui - shadcn/ui components
│   └── typescript-config/ # Shared TypeScript configurations
```

## 🛠️ Development Commands

### Common Tasks

```bash
pnpm dev              # Start dev server (all apps)
pnpm build            # Build all packages and apps
pnpm lint             # Lint all code with Biome
pnpm format           # Format all code with Biome
```

### Database

```bash
pnpm db:setup         # Create database with migrations
pnpm db:migrate       # Run pending migrations
pnpm db:studio        # Open Drizzle Studio (visual editor)

# Generate migrations after schema changes
pnpm --filter @workspace/db generate
```

### Docker

```bash
docker compose up -d  # Start in background
docker compose down   # Stop all services
docker compose logs -f web  # Follow web logs
docker compose exec web sh  # Shell in web container

# Or use Makefile
make up
make down
make logs
```

## 💡 Using Workspace Packages

Import components and utilities from workspace packages:

```tsx
// UI Components
import { Button, Card, Input } from "@workspace/ui/components";

// Authentication
import { useSession } from "@workspace/auth/client";
import { auth } from "@workspace/auth/server";

// Database
import { db, users, todos } from "@workspace/db";
```

## 🎨 Adding UI Components

Add shadcn/ui components to the UI package:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components are automatically added to `packages/ui/src/components/`.

## 🔒 Environment Variables

Create `.env` (Docker) or `.env.local` (local development):

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Better Auth
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000

# Optional: OAuth providers
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Auth**: Better Auth (email, OAuth, passkeys, 2FA)
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: shadcn/ui components
- **Monorepo**: Turborepo + pnpm workspaces
- **Code Quality**: Biome (linting & formatting), TypeScript
- **Containers**: Docker Compose with hot-reload

## 📚 Documentation

- [Auth Package Documentation](./packages/auth/README.md) - Better Auth setup and usage
- [Database Package Documentation](./packages/db/README.md) - Drizzle ORM, schema, and migrations

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Turborepo Documentation](https://turbo.build/repo/docs)

## 📝 License

MIT
