import { defineConfig } from "drizzle-kit";
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Load environment variables from the most relevant .env file
// Priority: repo root .env.local -> repo root .env -> package .env.local -> package .env
(() => {
	const currentFile = fileURLToPath(import.meta.url);
	const currentDir = dirname(currentFile);
	const packageRoot = currentDir; // this file lives at package root
	const repoRoot = join(packageRoot, "..", "..");
	const candidates = [
		join(repoRoot, ".env.local"),
		join(repoRoot, ".env"),
		join(packageRoot, ".env.local"),
		join(packageRoot, ".env"),
	];

	for (const candidate of candidates) {
		if (existsSync(candidate)) {
			loadEnv({ path: candidate });
			break;
		}
	}
})();

function buildDatabaseUrlFromEnv(): string | undefined {
	const url = process.env.DATABASE_URL;
	if (url && url.trim().length > 0) return url;

	const host = process.env.DB_HOST;
	const port = process.env.DB_PORT;
	const user = process.env.DB_USER;
	const password = process.env.DB_PASSWORD;
	const name = process.env.DB_NAME;

	if (host && port && user && name) {
		const auth = password && password.length > 0 ? `${user}:${password}` : user;
		return `postgresql://${auth}@${host}:${port}/${name}`;
	}

	return undefined;
}

const databaseUrl = buildDatabaseUrlFromEnv();

export default defineConfig({
	dialect: "postgresql",
	schema: ["./src/schema/auth.ts", "./src/schema/todos.ts"],
	out: "./drizzle/migrations",
	dbCredentials: {
		// Intentionally avoid hardcoded defaults. Require env configuration.
		url: (databaseUrl ?? ""),
	},
	verbose: true,
	strict: true,
});
