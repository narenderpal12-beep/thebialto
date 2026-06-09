THE BIALTO BY ASEMONT ESTATE — Windows Package
===============================================

REQUIREMENTS
  - Node.js 20 or 22 LTS  ->  https://nodejs.org
  - PostgreSQL 15 or 16   ->  https://www.postgresql.org/download/windows/

STEP 1 — Create the database
  Open pgAdmin or psql and run:
    CREATE DATABASE bialto;

STEP 2 — Configure environment
  Copy .env.example  ->  .env
  Edit .env:
    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/bialto
    SESSION_SECRET=any_long_random_string
    PORT=3000
    NODE_ENV=production

STEP 3 — Set up the database (run ONCE)
  Open a Command Prompt in this folder and run:
    npm install
    node setup-db.mjs

STEP 4 — Start the app
  Double-click start.bat
  OR in Command Prompt: node index.mjs

  Website: http://localhost:3000
  Admin:   http://localhost:3000/admin/login
           Email:    admin@bialto.com
           Password: admin123

CHANGE PORT
  Edit PORT=3000 in your .env file.

STOP THE SERVER
  Press Ctrl+C in the Command Prompt window.
