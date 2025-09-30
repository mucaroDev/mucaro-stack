DROP TABLE "invitation" CASCADE;--> statement-breakpoint
DROP TABLE "member" CASCADE;--> statement-breakpoint
DROP TABLE "organization" CASCADE;--> statement-breakpoint
DROP TABLE "passkey" CASCADE;--> statement-breakpoint
DROP TABLE "two_factor" CASCADE;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN IF EXISTS "active_organization_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "two_factor_enabled";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "banned";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "ban_reason";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "ban_expires";