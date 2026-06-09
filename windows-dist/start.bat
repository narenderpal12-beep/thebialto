@echo off
echo Starting The Bialto...

REM Load .env if it exists
if not exist .env (
  echo ERROR: .env file not found. Copy .env.example to .env and fill in your values.
  pause
  exit /b 1
)

REM Parse .env and set environment variables
for /f "usebackq tokens=1,* delims==" %%A in (.env) do (
  set %%A=%%B
)

REM Install npm dependencies if needed
if not exist node_modules (
  echo Installing dependencies...
  npm install --production
)

echo Server starting at http://localhost:%PORT%
node --enable-source-maps index.mjs
pause