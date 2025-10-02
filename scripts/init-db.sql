-- Database initialization script for Docker PostgreSQL
-- This runs automatically when the container is first created

-- Create the database if it doesn't exist (already handled by POSTGRES_DB)
-- Just ensure we're using the correct database

-- Set timezone
SET timezone = 'UTC';

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Mucaro Stack database initialized successfully';
END $$;

