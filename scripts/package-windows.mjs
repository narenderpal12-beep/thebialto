/**
 * Packages the Bialto app into a self-contained windows-dist/ folder.
 * Run on Replit: node scripts/package-windows.mjs
 *
 * Output: windows-dist/
 *   index.mjs          — bundled Express server (no pnpm needed to run)
 *   pino-*.mjs         — pino worker bundles
 *   public/            — built React frontend
 *   package.json       — minimal deps (npm install --production)
 *   setup-db.mjs       — one-time DB schema + admin seed setup
 *   schema.sql         — raw schema SQL (alternative setup)
 *   .env.example
 *   start.bat / start.ps1
 *   README.txt
 */

import { execSync } from "child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(root, "windows-dist");

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: root, ...opts });
}

// ── 1. Clean output dir ────────────────────────────────────────────────────
console.log("Cleaning windows-dist/ ...");
rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

// ── 2. Build frontend ──────────────────────────────────────────────────────
console.log("\nBuilding frontend (React/Vite)...");
run("pnpm --filter @workspace/bialto run build", {
  env: { ...process.env, NODE_ENV: "production", PORT: "3000", BASE_PATH: "/" },
});

// ── 3. Build API server ────────────────────────────────────────────────────
console.log("\nBuilding API server...");
run("pnpm --filter @workspace/api-server run build", {
  env: { ...process.env, NODE_ENV: "production" },
});

// ── 4. Copy API server bundle ──────────────────────────────────────────────
console.log("\nCopying server bundle...");
cpSync(path.join(root, "artifacts/api-server/dist"), distDir, { recursive: true });

// ── 5. Copy frontend into public/ ─────────────────────────────────────────
console.log("Copying frontend into public/...");
cpSync(path.join(root, "artifacts/bialto/dist/public"), path.join(distDir, "public"), { recursive: true });

// ── 6. Copy schema SQL ─────────────────────────────────────────────────────
console.log("Copying schema.sql...");
cpSync(path.join(root, "scripts/schema.sql"), path.join(distDir, "schema.sql"));

// ── 7. Write standalone package.json ──────────────────────────────────────
console.log("Writing package.json...");
writeFileSync(
  path.join(distDir, "package.json"),
  JSON.stringify({
    name: "bialto-server",
    version: "1.0.0",
    description: "The Bialto by Asemont Estate — production server",
    type: "module",
    scripts: {
      start: "node --env-file=.env --enable-source-maps index.mjs",
      setup: "node --env-file=.env setup-db.mjs",
    },
    dependencies: { nodemailer: "^8.0.10", pg: "^8.13.3" },
  }, null, 2) + "\n"
);

// ── 8. Write setup-db.mjs ─────────────────────────────────────────────────
console.log("Writing setup-db.mjs...");
writeFileSync(
  path.join(distDir, "setup-db.mjs"),
  `/**
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
  for (const line of env.split("\\n")) {
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
  .replace(/^\\\\restrict.*$/gm, "")
  .replace(/^\\\\unrestrict.*$/gm, "");

await client.query(schema);
console.log("Schema created.");

// ── Seed admin account ──────────────────────────────────────────────────
// Password: admin123  (SHA-256 of "admin123bialto_salt")
const PASSWORD_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

await client.query(\`
  INSERT INTO admins (email, name, password_hash)
  VALUES ('admin@bialto.com', 'Admin', $1)
  ON CONFLICT (email) DO NOTHING
\`, [PASSWORD_HASH]);
console.log("Admin account ready  (admin@bialto.com / admin123)");

// ── Seed default settings row ───────────────────────────────────────────
await client.query(\`
  INSERT INTO settings (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING
\`);
console.log("Default settings row created.");

await client.end();
console.log("\\n✅ Database setup complete! You can now run start.bat");
`
);

// ── 9. Write .env.example ─────────────────────────────────────────────────
writeFileSync(
  path.join(distDir, ".env.example"),
  [
    "# Copy this file to .env and fill in your values",
    "",
    "# PostgreSQL connection string",
    "# Example: postgresql://postgres:yourpassword@localhost:5432/bialto",
    "DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/bialto",
    "",
    "# JWT signing secret — any long random string",
    "SESSION_SECRET=change_me_to_a_long_random_string",
    "",
    "# Port the server listens on (default: 3000)",
    "PORT=3000",
    "",
    "# Must be production so the server serves the frontend",
    "NODE_ENV=production",
    "",
  ].join("\n")
);

// ── 10. Write start.bat ───────────────────────────────────────────────────
writeFileSync(
  path.join(distDir, "start.bat"),
  [
    "@echo off",
    "echo ============================================",
    "echo  The Bialto by Asemont Estate",
    "echo ============================================",
    "",
    "if not exist .env (",
    "  echo.",
    "  echo  ERROR: .env file not found.",
    "  echo  Copy .env.example to .env and fill in your values.",
    "  echo.",
    "  pause",
    "  exit /b 1",
    ")",
    "",
    "REM Load .env variables",
    "for /f \"usebackq tokens=1,* delims==\" %%A in (.env) do (",
    "  if not \"%%A\"==\"\" if not \"%%A:~0,1%\"==\"#\" set %%A=%%B",
    ")",
    "",
    "if not exist node_modules (",
    "  echo Installing npm dependencies...",
    "  npm install --production",
    "  echo.",
    ")",
    "",
    "if \"%PORT%\"==\"\" set PORT=3000",
    "echo  Server running at http://localhost:%PORT%",
    "echo  Press Ctrl+C to stop.",
    "echo.",
    "node --enable-source-maps index.mjs",
    "pause",
  ].join("\r\n")
);

// ── 11. Write start.ps1 ───────────────────────────────────────────────────
writeFileSync(
  path.join(distDir, "start.ps1"),
  [
    "# The Bialto — PowerShell startup script",
    "Write-Host '============================================'",
    "Write-Host ' The Bialto by Asemont Estate'",
    "Write-Host '============================================'",
    "",
    "if (-not (Test-Path '.env')) {",
    "    Write-Error '.env not found. Copy .env.example to .env and fill in your values.'",
    "    exit 1",
    "}",
    "",
    "# Load .env into current session",
    "Get-Content '.env' | ForEach-Object {",
    "    $line = $_.Trim()",
    "    if ($line -match '^\\s*#' -or $line -eq '') { return }",
    "    $parts = $line -split '=', 2",
    "    [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim())",
    "}",
    "",
    "if (-not (Test-Path 'node_modules')) {",
    "    Write-Host 'Installing npm dependencies...'",
    "    npm install --production",
    "}",
    "",
    "$port = if ($env:PORT) { $env:PORT } else { '3000' }",
    "Write-Host \"Server running at http://localhost:$port\"",
    "Write-Host 'Press Ctrl+C to stop.'",
    "node --enable-source-maps index.mjs",
  ].join("\n")
);

// ── 12. Write README.txt ──────────────────────────────────────────────────
writeFileSync(
  path.join(distDir, "README.txt"),
  [
    "THE BIALTO BY ASEMONT ESTATE — Windows Package",
    "===============================================",
    "",
    "REQUIREMENTS",
    "  - Node.js 20 or 22 LTS  ->  https://nodejs.org",
    "  - PostgreSQL 15 or 16   ->  https://www.postgresql.org/download/windows/",
    "",
    "STEP 1 — Create the database",
    "  Open pgAdmin or psql and run:",
    "    CREATE DATABASE bialto;",
    "",
    "STEP 2 — Configure environment",
    "  Copy .env.example  ->  .env",
    "  Edit .env with your PostgreSQL password and a secret string:",
    "    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/bialto",
    "    SESSION_SECRET=any_long_random_string",
    "    PORT=3000",
    "    NODE_ENV=production",
    "",
    "STEP 3 — Install dependencies (run ONCE)",
    "  Open Command Prompt in this folder and run:",
    "    npm install",
    "",
    "STEP 4 — Set up the database (run ONCE)",
    "    npm run setup",
    "",
    "STEP 5 — Start the app (every time)",
    "    npm start",
    "",
    "  Website: http://localhost:3000",
    "  Admin:   http://localhost:3000/admin/login",
    "           Email:    admin@bialto.com",
    "           Password: admin123",
    "",
    "CHANGE PORT",
    "  Edit PORT=3000 in your .env file.",
    "",
    "STOP THE SERVER",
    "  Press Ctrl+C in the Command Prompt window.",
    "",
  ].join("\n")
);

console.log("\n✅ windows-dist/ is ready.");
console.log("   Zip the windows-dist/ folder and copy to your Windows machine.");
console.log("   Follow README.txt inside for setup steps.");
