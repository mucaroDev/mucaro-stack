# Makefile for Mucaro Stack Docker commands
# Provides convenient shortcuts for common Docker operations

.PHONY: help up down restart logs shell db-shell build clean migrate

# Default target - show help
help:
	@echo "Mucaro Stack - Docker Commands"
	@echo "================================"
	@echo ""
	@echo "Setup:"
	@echo "  make setup          - Copy .env.example to .env (run once)"
	@echo ""
	@echo "Service Management:"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make restart        - Restart all services"
	@echo "  make build          - Rebuild containers"
	@echo "  make clean          - Stop services and remove volumes"
	@echo ""
	@echo "Logs:"
	@echo "  make logs           - View logs from all services"
	@echo "  make logs-web       - View logs from web service"
	@echo "  make logs-db        - View logs from database service"
	@echo ""
	@echo "Development:"
	@echo "  make shell          - Open shell in web container"
	@echo "  make db-shell       - Open psql shell in database"
	@echo "  make migrate        - Run database migrations"
	@echo ""
	@echo "Database:"
	@echo "  make db-backup      - Create database backup"
	@echo "  make db-reset       - Reset database (deletes all data)"
	@echo ""

# Setup - copy environment file
setup:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Created .env file from .env.example"; \
		echo "⚠️  Please edit .env and update BETTER_AUTH_SECRET"; \
	else \
		echo "⚠️  .env already exists, skipping..."; \
	fi

# Start all services
up:
	docker compose up -d
	@echo "✅ Services started!"
	@echo "🌐 Web: http://localhost:3000"
	@echo "🗄️  Database: localhost:5432"

# Start services with logs
up-logs:
	docker compose up

# Stop all services
down:
	docker compose down

# Restart all services
restart:
	docker compose restart

# Rebuild containers
build:
	docker compose up --build -d

# Stop and remove volumes (deletes database data)
clean:
	@echo "⚠️  This will delete all database data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v; \
		echo "✅ Cleaned up containers and volumes"; \
	else \
		echo "❌ Cancelled"; \
	fi

# View logs from all services
logs:
	docker compose logs -f

# View logs from web service
logs-web:
	docker compose logs -f web

# View logs from database service
logs-db:
	docker compose logs -f db

# Open shell in web container
shell:
	docker compose exec web sh

# Open psql shell in database
db-shell:
	docker compose exec db psql -U mucaro -d mucaro_dev

# Run database migrations
migrate:
	docker compose exec web sh -c "cd /app/packages/db && pnpm run migrate"

# Create database backup
db-backup:
	@mkdir -p backups
	@BACKUP_FILE="backups/mucaro_dev_$$(date +%Y%m%d_%H%M%S).sql"; \
	docker compose exec db pg_dump -U mucaro mucaro_dev > $$BACKUP_FILE; \
	echo "✅ Database backed up to $$BACKUP_FILE"

# Reset database (dangerous!)
db-reset:
	@echo "⚠️  This will DELETE ALL DATABASE DATA!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v db; \
		docker compose up -d db; \
		echo "⏳ Waiting for database to be ready..."; \
		sleep 5; \
		docker compose exec web sh -c "cd /app/packages/db && pnpm run migrate"; \
		echo "✅ Database reset complete"; \
	else \
		echo "❌ Cancelled"; \
	fi

# Install new dependencies (requires rebuild)
install:
	@echo "⚠️  After installing, you'll need to rebuild: make build"
	docker compose exec web pnpm install

# Run linting
lint:
	docker compose exec web pnpm run lint

# Run type checking
type-check:
	docker compose exec web pnpm run type-check

# Check container status
ps:
	docker compose ps

# View resource usage
stats:
	docker stats mucaro-web mucaro-db

