# @workspace/db

A TypeScript database package for the mucaro-stack monorepo using Drizzle ORM and PostgreSQL.

## Features

- 🚀 **Type-safe** database operations with Drizzle ORM
- 🔌 **Flexible connections** - each app can use its own database configuration
- 🏊 **Connection pooling** with node-postgres
- 🔄 **Migration management** with drizzle-kit
- 📊 **Database studio** for visual data management
- 🛡️ **Error handling** with custom error types
- ✅ **Validation** with Zod schemas
- 🆔 **Auto-generated UUIDs** - All user records get unique IDs automatically

## Installation

The package is already installed in the monorepo. To use it in your app:

```bash
# From your app directory
pnpm add @workspace/db
```

## Quick Start

### 1. Environment Variables

Create a `.env` file in your app with database credentials:

```env
# Option 1: Connection string (recommended)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Option 2: Individual parameters
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="user"
DB_PASSWORD="password"
DB_NAME="mydb"
DB_SSL="false"
```

### 2. Basic Usage

```typescript
import { createDatabase, validateEnvConfig, createUserOperations } from '@workspace/db';

// Create database connection
const config = validateEnvConfig(process.env);
const db = createDatabase(config);

// Create user operations (handles UUID generation automatically)
const userOps = createUserOperations(db);

// Create a user - ID will be auto-generated as UUID
const newUser = await userOps.createUser({
  email: "user@example.com",
  name: "John Doe"
});

console.log(newUser.id); // Auto-generated UUID like "123e4567-e89b-12d3-a456-426614174000"
```

### 3. Singleton Pattern (for single-database apps)

```typescript
import { getSingletonDatabase, validateEnvConfig } from '@workspace/db/connection';

// Initialize once
const config = validateEnvConfig(process.env);
const db = getSingletonDatabase(config);

// Use anywhere in your app
const db2 = getSingletonDatabase(); // Returns the same instance
```

## Connection Patterns

### Multiple Databases

Each app can create its own database connection:

```typescript
// apps/web/lib/db.ts
import { createDatabase } from '@workspace/db/connection';

export const db = createDatabase({
  connectionString: process.env.WEB_DATABASE_URL,
  max: 20, // Connection pool size
});

// apps/api/lib/db.ts
import { createDatabase } from '@workspace/db/connection';

export const db = createDatabase({
  connectionString: process.env.API_DATABASE_URL,
  max: 10,
});
```

### Custom Configuration

```typescript
import { createDatabase } from '@workspace/db/connection';

const db = createDatabase({
  host: 'localhost',
  port: 5432,
  user: 'myuser',
  password: 'mypassword',
  database: 'mydb',
  ssl: process.env.NODE_ENV === 'production',
  max: 20, // Max connections
  min: 0,  // Min connections
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 10000,
});
```

## Schema Management

### Adding New Tables

1. Create a new schema file:

```typescript
// packages/db/src/schema/posts.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content'),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

2. Export from the main schema file:

```typescript
// packages/db/src/schema/index.ts
export * from './users.js';
export * from './posts.js'; // Add this line
```

### Relations

```typescript
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { posts } from './posts.js';

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

## Migrations

### Generate Migrations

```bash
# From the db package directory
pnpm db:generate

# Or from the root
pnpm --filter @workspace/db db:generate
```

### Run Migrations

```bash
# From the db package directory
pnpm db:migrate

# Or from the root
pnpm --filter @workspace/db db:migrate
```

### Programmatic Migrations

```typescript
import { runMigrations } from '@workspace/db/migrations';
import { createDatabase, validateEnvConfig } from '@workspace/db/connection';

const config = validateEnvConfig(process.env);
const db = createDatabase(config);

await runMigrations(db, {
  migrationsFolder: './drizzle/migrations',
  verbose: true,
});
```

## Database Studio

Launch the visual database editor:

```bash
# From the db package directory
pnpm db:studio

# Or from the root
pnpm --filter @workspace/db db:studio
```

## Error Handling

The package provides custom error types:

```typescript
import { DatabaseError, ConnectionError, QueryError } from '@workspace/db/types';

try {
  const users = await db.select().from(users);
} catch (error) {
  if (error instanceof ConnectionError) {
    console.error('Database connection failed:', error.message);
  } else if (error instanceof QueryError) {
    console.error('Query failed:', error.message);
  } else if (error instanceof DatabaseError) {
    console.error('Database error:', error.message);
  }
}
```

## Health Checks

```typescript
import { healthCheck } from '@workspace/db/connection';

const isHealthy = await healthCheck(db);
if (!isHealthy) {
  console.error('Database is not responding');
}
```

## Best Practices

### 1. Connection Management

- Use `createDatabase()` for apps that need their own connection
- Use `getSingletonDatabase()` for simple single-database apps
- Always call `closeSingletonDatabase()` on app shutdown

### 2. Environment Configuration

- Use `validateEnvConfig()` to ensure required environment variables are present
- Prefer `DATABASE_URL` over individual connection parameters
- Enable SSL in production environments

### 3. Schema Design

- Use UUIDs for primary keys
- Include `createdAt` and `updatedAt` timestamps
- Create Zod schemas for validation
- Define relations for better type inference

### 4. Migrations

- Always generate migrations after schema changes
- Review generated migrations before applying
- Test migrations on staging before production

### 5. Error Handling

- Use the provided error types for better error categorization
- Implement proper retry logic for connection errors
- Log database errors with appropriate context

## Database Initialization

### Quick Setup

Initialize a new PostgreSQL database with the default name "mucaro":

```bash
# From the db package directory
pnpm db:init

# Or from the root
pnpm --filter @workspace/db db:init
```

### Custom Database Name

```bash
# Initialize with custom name
pnpm db:init myapp

# Or using the --name flag
pnpm db:init --name production
```

### What the initialization does:

1. ✅ Checks if the database already exists (exits if it does)
2. 📦 Creates the database if it doesn't exist
3. 🔄 Runs all pending migrations
4. ✅ Verifies setup with a health check

### Environment Variables for Initialization

```env
# Connection details (will use defaults if not provided)
DB_HOST=localhost          # Default: localhost
DB_PORT=5432              # Default: 5432
DB_USER=myuser            # Default: current system user
DB_PASSWORD=mypassword    # Optional
DB_SSL=false              # Default: false

# Or use a full connection string
DATABASE_URL=postgresql://user:password@localhost:5432/existing_db
```

### Help

```bash
pnpm db:init --help
```

## Development Scripts

```bash
# Initialize database
pnpm db:init

# Build the package
pnpm build

# Development with watch mode
pnpm dev

# Lint code
pnpm lint

# Generate migrations
pnpm generate

# Run migrations
pnpm migrate

# Open database studio
pnpm studio
```

## TypeScript Support

The package is fully typed with TypeScript. Import types as needed:

```typescript
import type { Database, DatabaseConfig } from '@workspace/db/connection';
import type { User, NewUser } from '@workspace/db/schema';
import type { BaseEntity, TimestampFields } from '@workspace/db/types';
```

