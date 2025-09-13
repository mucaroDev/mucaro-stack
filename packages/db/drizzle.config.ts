import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: ["./src/schema/users.ts", "./src/schema/auth.ts"],
	out: "./drizzle/migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL || "postgresql://localhost:5432/mucaro",
	},
	verbose: true,
	strict: true,
});
