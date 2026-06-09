THE BIALTO BY ASEMONT ESTATE — Windows Production Package
=========================================================

REQUIREMENTS
  - Node.js 20 or 22 LTS  (https://nodejs.org)
  - PostgreSQL 15 or 16   (https://www.postgresql.org/download/windows/)

FIRST TIME SETUP
  1. Create a PostgreSQL database called 'bialto'
     In psql: CREATE DATABASE bialto;

  2. Copy .env.example to .env
     Set DATABASE_URL and SESSION_SECRET

  3. Run the database schema setup (one time only):
     See WINDOWS_SETUP.md in the project root for instructions.

START THE APP
  Double-click start.bat
  OR in PowerShell: .\start.ps1

  Then open http://localhost:3000 in your browser.
  Admin panel: http://localhost:3000/admin/login
  Email: admin@bialto.com  /  Password: admin123

CHANGE THE PORT
  Edit PORT=3000 in your .env file.
