-- Add Clerk integration and profile settings to users table
ALTER TABLE "users" ADD COLUMN "clerk_id" text;
ALTER TABLE "users" ADD COLUMN "dark_mode" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN "timezone" text DEFAULT 'UTC';
ALTER TABLE "users" ADD COLUMN "language" text DEFAULT 'en';

-- Create a unique constraint on clerk_id after adding the column
-- We'll update existing users with temporary clerk_ids first
UPDATE "users" SET "clerk_id" = 'temp_' || "id" WHERE "clerk_id" IS NULL;
ALTER TABLE "users" ALTER COLUMN "clerk_id" SET NOT NULL;
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id");
