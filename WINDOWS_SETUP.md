# Running The Bialto on Windows

## Prerequisites

Install these before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 20 or 22 LTS | https://nodejs.org |
| pnpm | latest | `npm install -g pnpm` |
| PostgreSQL | 15 or 16 | https://www.postgresql.org/download/windows/ |

> **Important:** When installing PostgreSQL, note the password you set for the `postgres` user.

---

## 1. Clone / download the project

```
git clone <repo-url>
cd bialto
```

Or download and extract the ZIP, then open a terminal in that folder.

---

## 2. Create the database

Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE bialto;
```

---

## 3. Set environment variables

Copy the example file and fill in your values:

```
copy .env.example .env
```

Open `.env` in Notepad and edit:

```env
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/bialto
SESSION_SECRET=any_long_random_string_here
```

---

## 4. Install dependencies

```
pnpm install
```

---

## 5. Push the database schema

```
pnpm --filter @workspace/db run push
```

This creates all tables. When prompted, type `y` to confirm.

---

## 6. Start the servers

Open **two separate terminals** in the project folder.

**Terminal 1 — API server:**
```
pnpm --filter @workspace/api-server run dev
```
Starts on port `8080`. Wait for: `Server listening on port 8080`

**Terminal 2 — Frontend:**
```
pnpm --filter @workspace/bialto run dev
```
Starts on port `21406`. Wait for: `VITE ready in ...`

---

## 7. Open the app

| Page | URL |
|------|-----|
| Public website | http://localhost:21406 |
| Admin panel | http://localhost:21406/admin/login |

**Admin login:**
- Email: `admin@bialto.com`
- Password: `admin123`

---

## Loading environment variables on Windows

Node.js does **not** automatically read `.env` files. Use one of these approaches:

### Option A — dotenv-cli (recommended)

```
npm install -g dotenv-cli
dotenv -- pnpm --filter @workspace/api-server run dev
dotenv -- pnpm --filter @workspace/bialto run dev
```

### Option B — Set variables in PowerShell before starting

```powershell
$env:DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/bialto"
$env:SESSION_SECRET="your_secret"
pnpm --filter @workspace/api-server run dev
```

### Option C — Set permanent system environment variables

1. Open **Start → Search → "Edit the system environment variables"**
2. Click **Environment Variables**
3. Under **User variables**, click **New** and add:
   - `DATABASE_URL` = `postgresql://postgres:YOUR_PASSWORD@localhost:5432/bialto`
   - `SESSION_SECRET` = `your_secret_string`
4. Restart your terminals

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `pnpm: command not found` | Run `npm install -g pnpm` first |
| `Cannot find DATABASE_URL` | Make sure env vars are set (see above) |
| `ECONNREFUSED` on DB | PostgreSQL service not running — open Services and start it |
| Port already in use | Change `PORT=` in `.env` or kill the process using that port |
| `cross-env: not found` | Run `pnpm install` again from the project root |

---

## Making a production build

```
pnpm --filter @workspace/bialto run build
pnpm --filter @workspace/api-server run build
```

Frontend output: `artifacts/bialto/dist/`  
API server output: `artifacts/api-server/dist/index.mjs`

To serve the built frontend, point a static file server (e.g. nginx, IIS, or `serve`) at `artifacts/bialto/dist/`.
