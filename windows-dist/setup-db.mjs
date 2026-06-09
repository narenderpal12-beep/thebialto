/**
 * One-time database setup for The Bialto on Windows.
 * Run ONCE before starting the server for the first time:
 *
 *   node setup-db.mjs
 *
 * Requires: DATABASE_URL set in your environment or .env file
 *           PostgreSQL must be running and the database must exist.
 */

import { readFileSync } from "fs";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env manually if it exists
try {
  const env = readFileSync(path.join(__dirname, ".env"), "utf8");
  for (const line of env.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set. Check your .env file.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();
console.log("Connected to database.");

// ── Create all tables ───────────────────────────────────────────────────
const schema = readFileSync(path.join(__dirname, "schema.sql"), "utf8")
  // strip pg_dump escape markers
  .replace(/^\\restrict.*$/gm, "")
  .replace(/^\\unrestrict.*$/gm, "");

await client.query(schema);
console.log("Schema created.");

// ── Seed admin account ──────────────────────────────────────────────────
// Password: admin123  (SHA-256 of "admin123bialto_salt")
const PASSWORD_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

await client.query(`
  INSERT INTO admins (email, name, password_hash)
  VALUES ('admin@bialto.com', 'Admin', $1)
  ON CONFLICT (email) DO NOTHING
`, [PASSWORD_HASH]);
console.log("Admin account ready  (admin@bialto.com / admin123)");

// ── Seed default settings row ───────────────────────────────────────────
await client.query(`
  INSERT INTO settings (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING
`);
console.log("Default settings row created.");

await client.end();
console.log("\n✅ Database setup complete! You can now run start.bat");
