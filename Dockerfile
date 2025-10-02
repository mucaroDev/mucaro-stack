# Development Dockerfile for Mucaro Stack
# Optimized for hot-reload and pnpm workspaces

FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY turbo.json biome.json tsconfig.json ./

# Copy package.json files for all workspaces (for dependency resolution)
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy workspace packages source code
COPY packages/ ./packages/

# Copy web app source (in dev, this will be volume-mounted for hot reload)
COPY apps/web/ ./apps/web/

# Build workspace packages
RUN pnpm --filter @workspace/typescript-config build || true
RUN pnpm --filter @workspace/db build
RUN pnpm --filter @workspace/auth build
RUN pnpm --filter @workspace/ui build

# Expose Next.js port
EXPOSE 3000

# Set working directory to web app
WORKDIR /app/apps/web

# Start development server
CMD ["pnpm", "dev"]

