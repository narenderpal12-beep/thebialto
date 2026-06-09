/**
 * Packages the Bialto app into a self-contained windows-dist/ folder.
 * Run on Replit: node scripts/package-windows.mjs
 *
 * Output: windows-dist/
 *   index.mjs          — bundled Express server
 *   pino-*.mjs         — pino worker bundles
 *   public/            — built React frontend
 *   package.json       — minimal deps (npm install runs fine on Windows)
 *   .env.example
 *   start.bat
 *   start.ps1
 */

import { execSync } from "child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "fs";
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
run(
  "pnpm --filter @workspace/bialto run build",
  {
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: "3000",
      BASE_PATH: "/",
    },
  }
);

// ── 3. Build API server ────────────────────────────────────────────────────
console.log("\nBuilding API server...");
run(
  "pnpm --filter @workspace/api-server run build",
  {
    env: { ...process.env, NODE_ENV: "production" },
  }
);

// ── 4. Copy API server bundle ──────────────────────────────────────────────
console.log("\nCopying server bundle...");
const apiDist = path.join(root, "artifacts/api-server/dist");
cpSync(apiDist, distDir, { recursive: true });

// ── 5. Copy frontend into public/ ─────────────────────────────────────────
console.log("Copying frontend into public/...");
const frontendDist = path.join(root, "artifacts/bialto/dist/public");
cpSync(frontendDist, path.join(distDir, "public"), { recursive: true });

// ── 6. Write standalone package.json ──────────────────────────────────────
console.log("Writing package.json...");
const pkg = {
  name: "bialto-server",
  version: "1.0.0",
  description: "The Bialto by Asemont Estate — production server",
  type: "module",
  scripts: {
    start: "node --enable-source-maps index.mjs",
  },
  dependencies: {
    nodemailer: "^8.0.10",
  },
};
writeFileSync(
  path.join(distDir, "package.json"),
  JSON.stringify(pkg, null, 2) + "\n"
);

// ── 7. Write .env.example ─────────────────────────────────────────────────
writeFileSync(
  path.join(distDir, ".env.example"),
  [
    "# Copy this file to .env and fill in your values",
    "",
    "# PostgreSQL connection string",
    "DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/bialto",
    "",
    "# JWT signing secret — any long random string",
    "SESSION_SECRET=change_me_to_a_long_random_string",
    "",
    "# Port the server listens on (default: 3000)",
    "PORT=3000",
    "",
    "# Leave NODE_ENV as production",
    "NODE_ENV=production",
    "",
  ].join("\n")
);

// ── 8. Write start.bat ────────────────────────────────────────────────────
writeFileSync(
  path.join(distDir, "start.bat"),
  [
    "@echo off",
    "echo Starting The Bialto...",
    "",
    "REM Load .env if it exists",
    "if not exist .env (",
    '  echo ERROR: .env file not found. Copy .env.example to .env and fill in your values.',
    "  pause",
    "  exit /b 1",
    ")",
    "",
    "REM Parse .env and set environment variables",
    "for /f \"usebackq tokens=1,* delims==\" %%A in (.env) do (",
    "  set %%A=%%B",
    ")",
    "",
    "REM Install npm dependencies if needed",
    "if not exist node_modules (",
    "  echo Installing dependencies...",
    "  npm install --production",
    ")",
    "",
    "echo Server starting at http://localhost:%PORT%",
    "node --enable-source-maps index.mjs",
    "pause",
  ].join("\r\n")
);

// ── 9. Write start.ps1 ────────────────────────────────────────────────────
writeFileSync(
  path.join(distDir, "start.ps1"),
  [
    "# The Bialto — Windows startup script",
    "",
    "if (-not (Test-Path '.env')) {",
    "    Write-Error '.env not found. Copy .env.example to .env and fill in your values.'",
    "    exit 1",
    "}",
    "",
    "# Load .env into current session",
    "Get-Content '.env' | ForEach-Object {",
    "    if ($_ -match '^\\s*#' -or $_ -match '^\\s*$') { return }",
    "    $parts = $_ -split '=', 2",
    "    [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim())",
    "}",
    "",
    "# Install npm deps if needed",
    "if (-not (Test-Path 'node_modules')) {",
    "    Write-Host 'Installing dependencies...'",
    "    npm install --production",
    "}",
    "",
    "$port = if ($env:PORT) { $env:PORT } else { '3000' }",
    "Write-Host \"Server starting at http://localhost:$port\"",
    "node --enable-source-maps index.mjs",
  ].join("\n")
);

// ── 10. Write README ──────────────────────────────────────────────────────
writeFileSync(
  path.join(distDir, "README.txt"),
  [
    "THE BIALTO BY ASEMONT ESTATE — Windows Production Package",
    "=========================================================",
    "",
    "REQUIREMENTS",
    "  - Node.js 20 or 22 LTS  (https://nodejs.org)",
    "  - PostgreSQL 15 or 16   (https://www.postgresql.org/download/windows/)",
    "",
    "FIRST TIME SETUP",
    "  1. Create a PostgreSQL database called 'bialto'",
    "     In psql: CREATE DATABASE bialto;",
    "",
    "  2. Copy .env.example to .env",
    "     Set DATABASE_URL and SESSION_SECRET",
    "",
    "  3. Run the database schema setup (one time only):",
    "     See WINDOWS_SETUP.md in the project root for instructions.",
    "",
    "START THE APP",
    "  Double-click start.bat",
    "  OR in PowerShell: .\\start.ps1",
    "",
    "  Then open http://localhost:3000 in your browser.",
    "  Admin panel: http://localhost:3000/admin/login",
    "  Email: admin@bialto.com  /  Password: admin123",
    "",
    "CHANGE THE PORT",
    "  Edit PORT=3000 in your .env file.",
    "",
  ].join("\n")
);

console.log("\n✅ Done! windows-dist/ is ready.");
console.log("   Share the windows-dist/ folder with your Windows machine.");
console.log("   On Windows: copy .env.example → .env, fill it in, then run start.bat");
