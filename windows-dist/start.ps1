# The Bialto — Windows startup script

if (-not (Test-Path '.env')) {
    Write-Error '.env not found. Copy .env.example to .env and fill in your values.'
    exit 1
}

# Load .env into current session
Get-Content '.env' | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
    $parts = $_ -split '=', 2
    [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim())
}

# Install npm deps if needed
if (-not (Test-Path 'node_modules')) {
    Write-Host 'Installing dependencies...'
    npm install --production
}

$port = if ($env:PORT) { $env:PORT } else { '3000' }
Write-Host "Server starting at http://localhost:$port"
node --enable-source-maps index.mjs