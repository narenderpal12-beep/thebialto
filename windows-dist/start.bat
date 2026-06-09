@echo off
echo ============================================
echo  The Bialto by Asemont Estate
echo ============================================

if not exist .env (
  echo.
  echo  ERROR: .env file not found.
  echo  Copy .env.example to .env and fill in your values.
  echo.
  pause
  exit /b 1
)

REM Load .env variables
for /f "usebackq tokens=1,* delims==" %%A in (.env) do (
  if not "%%A"=="" if not "%%A:~0,1%"=="#" set %%A=%%B
)

if not exist node_modules (
  echo Installing npm dependencies...
  npm install --production
  echo.
)

if "%PORT%"=="" set PORT=3000
echo  Server running at http://localhost:%PORT%
echo  Press Ctrl+C to stop.
echo.
node --enable-source-maps index.mjs
pause