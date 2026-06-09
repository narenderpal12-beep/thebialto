# The Bialto — PowerShell startup script
Write-Host '============================================'
Write-Host ' The Bialto by Asemont Estate'
Write-Host '============================================'

if (-not (Test-Path '.env')) {
    Write-Error '.env not found. Copy .env.example to .env and fill in your values.'
    exit 1
}

# Load .env into current session
Get-Content '.env' | ForEach-Object {
    $line = $_.Trim()
    if ($line -match '^\s*#' -or $line -eq '') { return }
    $parts = $line -split '=', 2
    [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim())
}

if (-not (Test-Path 'node_modules')) {
    Write-Host 'Installing npm dependencies...'
    npm install --production
}

$port = if ($env:PORT) { $env:PORT } else { '3000' }
Write-Host "Server running at http://localhost:$port"
Write-Host 'Press Ctrl+C to stop.'
node --enable-source-maps index.mjs