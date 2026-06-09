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
  Edit .env with your PostgreSQL password and a secret string:
    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/bialto
    SESSION_SECRET=any_long_random_string
    PORT=3000
    NODE_ENV=production

STEP 3 — Install dependencies (run ONCE)
  Open Command Prompt in this folder and run:
    npm install

STEP 4 — Set up the database (run ONCE)
    npm run setup

STEP 5 — Start the app (every time)
    npm start

  Website: http://localhost:3000
  Admin:   http://localhost:3000/admin/login
           Email:    admin@bialto.com
           Password: admin123

CHANGE PORT
  Edit PORT=3000 in your .env file.

STOP THE SERVER
  Press Ctrl+C in the Command Prompt window.
